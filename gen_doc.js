const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  ShadingType, Table, TableRow, TableCell, WidthType, BorderStyle
} = require("docx");

const CODE_FILL = "F2F2F2";
const ACCENT = "2E5395";

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size ?? 22 })],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 }, text });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, text });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function codeBlock(lines) {
  return lines.map((line, i) => new Paragraph({
    shading: { type: ShadingType.CLEAR, color: "auto", fill: CODE_FILL },
    spacing: { before: 0, after: 0 },
    indent: { left: 200 },
    children: [new TextRun({ text: line, font: "Courier New", size: 19 })],
  }));
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

const doc = new Document({
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 } },
    },
    children: [
      // Portada
      new Paragraph({ spacing: { before: 2400, after: 240 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Sustentación", bold: true, size: 56, color: ACCENT })] }),
      new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Ambiente de Desarrollo Vagrant + VirtualBox + Ubuntu", bold: true, size: 32 })] }),
      new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Guía práctica: configuración de VMs, conectividad, publicación de box y taller de comandos Linux", italics: true, size: 22 })] }),
      new Paragraph({ spacing: { after: 480 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "4 de agosto de 2026", size: 22 })] }),
      p("Este documento resume, con los comandos exactos y sus resultados reales, todo lo ejecutado para preparar la sustentación: creación de dos máquinas virtuales (servidor y cliente) con Vagrant y VirtualBox, prueba de conectividad entre ellas, empaquetado y publicación de un box personalizado en Vagrant Cloud, y el taller de comandos básicos de Linux."),
      new Paragraph({ children: [], pageBreakBefore: true }),

      // 1. Configuración del ambiente
      h1("1. Configuración del ambiente Vagrant + VirtualBox + Ubuntu"),
      p("Se usó VirtualBox 7.2.14 y Vagrant 2.4.9, ya instalados en Windows. Se verificó la instalación desde PowerShell:"),
      ...codeBlock(["vagrant --version"]),
      spacer(),

      h2("Creación del proyecto"),
      p("Se creó una carpeta de trabajo y se inicializó un Vagrantfile base:"),
      ...codeBlock(["mkdir prueba", "cd prueba", "vagrant init"]),
      spacer(),

      h2("Vagrantfile: dos máquinas virtuales"),
      p("El Vagrantfile generado se reemplazó por uno que define dos VMs con IP privada fija cada una, usando la box bento/ubuntu-22.04: servidor (192.168.50.3) y cliente (192.168.50.2)."),
      ...codeBlock([
        '# -*- mode: ruby -*-',
        '# vi: set ft=ruby :',
        'Vagrant.configure("2") do |config|',
        '    config.vm.define :servidor do |servidor|',
        '        servidor.vm.box = "bento/ubuntu-22.04"',
        '        servidor.vm.network :private_network, ip: "192.168.50.3"',
        '        servidor.vm.hostname = "servidor"',
        '    end',
        '    config.vm.define :cliente do |cliente|',
        '        cliente.vm.box = "bento/ubuntu-22.04"',
        '        cliente.vm.network :private_network, ip: "192.168.50.2"',
        '        cliente.vm.hostname = "cliente"',
        '    end',
        'end',
      ]),
      spacer(),

      h2("Levantar las máquinas"),
      p("vagrant up crea y arranca ambas VMs. La primera vez descarga la box (~1 GB) desde Vagrant Cloud. El puerto de reenvío SSH del host quedó en 2222 para servidor y en 2200 para cliente (Vagrant resolvió automáticamente el choque de puertos)."),
      ...codeBlock(["vagrant up", "vagrant status"]),
      spacer(),

      h2("Configuración de cada máquina"),
      p("Se entró por SSH a cada VM, se pasó a usuario root y se instalaron las utilidades net-tools (para ifconfig) y vim. El mismo procedimiento se repitió en servidor y en cliente."),
      ...codeBlock([
        "vagrant ssh servidor",
        "sudo -i",
        "apt-get update",
        "apt-get install -y net-tools vim",
        "",
        "# Repetir igual para la otra máquina:",
        "vagrant ssh cliente",
      ]),
      spacer(),

      h2("Ciclo de vida de la VM"),
      p("Comandos de administración usados a lo largo del taller:"),
      new Table({
        width: { size: 9350, type: WidthType.DXA },
        columnWidths: [2400, 6950],
        rows: [
          new TableRow({ children: [
            headerCell("Comando", 2400), headerCell("Qué hace", 6950),
          ]}),
          dataRow("vagrant suspend", "Guarda el estado actual y detiene la máquina"),
          dataRow("vagrant up", "Reanuda una máquina suspendida o apagada"),
          dataRow("vagrant halt", "Apaga la máquina de forma segura conservando el disco"),
          dataRow("vagrant destroy", "Elimina completamente la máquina virtual"),
        ],
      }),
      new Paragraph({ children: [], pageBreakBefore: true }),

      // 2. Conectividad
      h1("2. Prueba de conectividad entre cliente y servidor"),
      p("Dentro de cada VM se confirmó la IP asignada en la interfaz de red privada y se probó la conexión con la otra máquina."),
      h2("Verificar IP con ifconfig"),
      ...codeBlock(["ifconfig"]),
      p("Resultado real obtenido: servidor → inet 192.168.50.3, cliente → inet 192.168.50.2 (netmask 255.255.255.0). Ambas IPs coinciden con lo definido en el Vagrantfile.", { after: 200 }),

      h2("Ping cruzado"),
      p("Se hizo ping desde cada máquina hacia la otra para confirmar la conectividad de la red privada."),
      ...codeBlock([
        "# desde cliente hacia servidor",
        "ping -c 4 192.168.50.3",
        "",
        "# desde servidor hacia cliente",
        "ping -c 4 192.168.50.2",
      ]),
      p("Resultado real: 4 paquetes transmitidos, 4 recibidos, 0% packet loss en ambas direcciones, con tiempos de respuesta entre 0.8 ms y 3.9 ms. Esto confirma que la red privada 192.168.50.0/24 funciona correctamente entre las dos VMs.", { after: 200 }),
      new Paragraph({ children: [], pageBreakBefore: true }),

      // 3. Box en Vagrant Cloud
      h1("3. Box publicado en Vagrant Cloud"),
      h2("Empaquetar la máquina modificada"),
      p("Se empaquetó la VM servidor (ya con net-tools y vim instalados) en un archivo .box. Este comando apaga automáticamente la VM para poder exportar su estado completo."),
      ...codeBlock(["vagrant package servidor --output mynew.box"]),
      p("Resultado real: se generó el archivo mynew.box de aproximadamente 943 MB.", { after: 200 }),

      h2("Agregar el box localmente"),
      ...codeBlock(["vagrant box add mynewbox mynew.box", "vagrant box list"]),
      spacer(),

      h2("Publicar en HCP Vagrant Cloud"),
      p("La publicación se hizo manualmente desde el navegador, en portal.cloud.hashicorp.com, iniciando sesión con la cuenta de GitHub. Pasos realizados:"),
      bullet("Vagrant Registry → Crear box Registry → nombre: servidor-taller"),
      bullet("Create box → nombre: ubuntu-servidor → visibilidad: Public"),
      bullet("Add a version → versión: 0.0.1 (formato X.Y.Z)"),
      bullet("Add providers → provider: virtualbox, arquitectura: amd64, File hosting: \"Upload file\" → se subió mynew.box (989.2 MB)"),
      bullet("Upload & Release → botón \"Release now\""),
      spacer(),
      p("Resultado: el box quedó publicado y liberado (estado Released) en servidor-taller/ubuntu-servidor, versión 0.0.1. Cualquiera puede inicializarlo con:"),
      ...codeBlock(["vagrant init servidor-taller/ubuntu-servidor --box-version 0.0.1"]),
      new Paragraph({ children: [], pageBreakBefore: true }),

      // 4. Taller de comandos Linux
      h1("4. Taller de comandos Linux"),
      p("Ejecutado en vivo dentro de la VM servidor, por SSH. A continuación el paso a paso con los comandos reales y una explicación corta de cada uno."),

      h2("4.1 Navegación"),
      p("pwd muestra el directorio actual; cd cambia de directorio. cd ~ va al home, cd .. sube un nivel, cd ../../.. sube varios niveles de una vez."),
      ...codeBlock(["pwd", "cd ~", "cd temp/stuff", "cd ..", "cd ../../..", "cd ~"]),
      spacer(),

      h2("4.2 Crear estructura de directorios"),
      p("mkdir crea un directorio, pero falla si el padre no existe. mkdir -p crea toda la ruta de una sola vez, incluso si los directorios intermedios no existen todavía."),
      ...codeBlock([
        "mkdir temp",
        "mkdir temp/stuff",
        "mkdir temp/stuff/things",
        "mkdir -p temp/stuff/things/orange/apple/pear/grape",
        "find temp -type d",
      ]),
      p("Resultado real: find temp -type d mostró las 7 carpetas creadas, confirmando toda la ruta anidada.", { after: 200 }),

      h2("4.3 Listar contenido"),
      ...codeBlock(["ls"]),
      spacer(),

      h2("4.4 Eliminar directorios vacíos"),
      p("rmdir solo borra directorios vacíos, y se debe hacer de adentro hacia afuera, un directorio a la vez."),
      ...codeBlock(["rmdir grape", "rmdir pear"]),
      spacer(),

      h2("4.5 pushd / popd — pila de directorios"),
      p("pushd guarda la ubicación actual en una pila y navega al nuevo directorio. popd vuelve a la ubicación guardada. pushd sin argumentos intercambia las dos ubicaciones en el tope de la pila."),
      ...codeBlock([
        "pushd i/like/icecream",
        "popd",
        "pushd i/like/icecream",
        "pushd",
      ]),
      spacer(),

      h2("4.6 Crear archivos vacíos"),
      ...codeBlock(["touch iamcool.txt"]),
      spacer(),

      h2("4.7 Copiar archivos y directorios"),
      p("cp copia archivos. cp -r copia directorios completos de forma recursiva."),
      ...codeBlock(["cp iamcool.txt neat.txt", "cp -r something newplace"]),
      spacer(),

      h2("4.8 Mover / renombrar"),
      p("mv mueve o renombra archivos y directorios (en Linux renombrar es simplemente moverlo al mismo lugar con otro nombre)."),
      ...codeBlock(["mv awesome.txt uncool.txt", "mv something newplace"]),
      spacer(),

      h2("4.9 Ver contenido de archivos: cat, more y less"),
      p("Este punto suele preguntarse directamente en la sustentación — la diferencia clave está en la paginación:"),
      bullet("cat archivo.txt → vuelca todo el contenido de una sola vez, sin paginar. Útil para archivos cortos o para concatenar/redirigir."),
      bullet("more archivo.txt → paginador simple, solo avanza hacia adelante (barra espaciadora avanza, q sale)."),
      bullet("less archivo.txt → paginador interactivo completo: avanza y retrocede, permite buscar texto con /patrón, sale con q. Es más eficiente porque no necesita cargar todo el archivo de una vez."),
      p("less y more son interactivos y controlan la terminal directamente, por eso se deben mostrar escribiendo el comando en vivo durante la sustentación (no se pueden automatizar dentro de un script).", { after: 200 }),
      ...codeBlock(["cat demo.txt", "more demo.txt", "less demo.txt"]),
      spacer(),

      h2("4.10 Eliminar archivos y directorios"),
      p("rm elimina archivos (se pueden pasar varios a la vez). rm -rf borra un directorio completo con todo su contenido, sin pedir confirmación — es irreversible, se debe usar con cuidado."),
      ...codeBlock([
        "rm uncool.txt",
        "rm iamcool.txt neat.txt demo.txt",
        "rm -rf newplace",
      ]),
      spacer(),

      h2("4.11 Salir de la terminal"),
      ...codeBlock(["exit"]),
      spacer(),

      h2("Referencia rápida adicional"),
      p("Comandos complementarios usados/mencionados, con su resultado real cuando aplica:"),
      bullet("uname -a → info del kernel. Real: Linux servidor 5.15.0-160-generic ... x86_64"),
      bullet("df -h → uso de disco. Real: partición raíz 31G, 17% usado"),
      bullet("free -h → uso de memoria. Real: 2.9Gi total, ~195Mi usado"),
      bullet("ps aux | head -5 → procesos activos del sistema"),
      bullet("grep root /etc/passwd → búsqueda de texto dentro de un archivo"),
      bullet("chmod → permisos de archivos. Real: chmod 700 archivo.txt dejó el archivo en rwx------ (solo el dueño puede leer/escribir/ejecutar)"),
      bullet("ssh usuario@host → conexión remota; ya se usó durante todo el taller a través de vagrant ssh"),
      new Paragraph({ children: [], pageBreakBefore: true }),

      // Cierre
      h1("Checklist final"),
      bullet("vagrant up funcionando con las dos máquinas (servidor y cliente)"),
      bullet("net-tools y vim instalados en ambas VMs"),
      bullet("ping exitoso entre cliente y servidor, IPs verificadas con ifconfig"),
      bullet("Box publicado y liberado (Released) en Vagrant Cloud: servidor-taller/ubuntu-servidor v0.0.1"),
      bullet("Taller de comandos Linux completo: navegación, estructura de directorios, pushd/popd, copiar/mover/eliminar, cat/more/less, referencia rápida"),
    ],
  }],
});

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, color: "auto", fill: ACCENT },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })] })],
  });
}
function dataCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
  });
}
function dataRow(cmd, desc) {
  return new TableRow({ children: [dataCell(cmd, 2400), dataCell(desc, 6950)] });
}

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync("Sustentacion_Vagrant_VirtualBox_Ubuntu.docx", buf);
  console.log("OK");
});
