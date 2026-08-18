#!/bin/bash
# Taller de comandos Linux - ejecucion completa punto 4 de la guia
cd ~
rm -rf temp i something newplace oldplace iamcool.txt neat.txt uncool.txt awesome.txt demo.txt permisos.txt 2>/dev/null

echo "##### 4.1 NAVEGACION (pwd, cd) #####"
echo "\$ pwd"
pwd

echo "##### 4.2 CREAR ESTRUCTURA DE DIRECTORIOS #####"
echo "\$ mkdir temp"
mkdir temp
echo "\$ mkdir temp/stuff"
mkdir temp/stuff
echo "\$ mkdir temp/stuff/things"
mkdir temp/stuff/things
echo "\$ mkdir -p temp/stuff/things/orange/apple/pear/grape"
mkdir -p temp/stuff/things/orange/apple/pear/grape
echo "\$ find temp -type d"
find temp -type d

echo "##### 4.1 NAVEGACION (continuacion, ya con estructura creada) #####"
echo "\$ cd temp/stuff"
cd temp/stuff
echo "\$ pwd"
pwd
echo "\$ cd .."
cd ..
echo "\$ pwd"
pwd
echo "\$ cd temp/stuff/things/orange/apple/pear/grape"
cd temp/stuff/things/orange/apple/pear/grape
echo "\$ pwd"
pwd
echo "\$ cd ../../.."
cd ../../..
echo "\$ pwd"
pwd
echo "\$ cd ~"
cd ~
echo "\$ pwd"
pwd

echo "##### 4.3 LISTAR CONTENIDO (ls) #####"
echo "\$ cd temp/stuff/things/orange/apple/pear"
cd temp/stuff/things/orange/apple/pear
echo "\$ ls"
ls
cd ~

echo "##### 4.4 ELIMINAR DIRECTORIOS VACIOS (rmdir) #####"
echo "\$ cd temp/stuff/things/orange/apple/pear"
cd temp/stuff/things/orange/apple/pear
echo "\$ rmdir grape"
rmdir grape
echo "\$ ls"
ls
echo "\$ cd .."
cd ..
echo "\$ rmdir pear"
rmdir pear
echo "\$ ls"
ls
cd ~

echo "##### 4.5 PUSHD / POPD #####"
echo "\$ mkdir -p i/like/icecream"
mkdir -p i/like/icecream
echo "\$ pushd i/like/icecream"
pushd i/like/icecream
echo "\$ pwd"
pwd
echo "\$ popd"
popd
echo "\$ pwd"
pwd
echo "\$ pushd i/like/icecream"
pushd i/like/icecream
echo "\$ pushd   (sin argumentos, intercambia el tope de la pila)"
pushd
echo "\$ pwd"
pwd
cd ~

echo "##### 4.6 CREAR ARCHIVOS VACIOS (touch) #####"
echo "\$ touch iamcool.txt"
touch iamcool.txt
echo "\$ ls -l iamcool.txt"
ls -l iamcool.txt

echo "##### 4.7 COPIAR ARCHIVOS Y DIRECTORIOS (cp) #####"
echo "\$ cp iamcool.txt neat.txt"
cp iamcool.txt neat.txt
echo "\$ ls -l iamcool.txt neat.txt"
ls -l iamcool.txt neat.txt
echo "\$ cp -r temp/stuff/things/orange something"
cp -r temp/stuff/things/orange something
echo "\$ ls something"
ls something

echo "##### 4.8 MOVER / RENOMBRAR (mv) #####"
echo "\$ touch awesome.txt"
touch awesome.txt
echo "\$ mv awesome.txt uncool.txt"
mv awesome.txt uncool.txt
echo "\$ ls uncool.txt"
ls uncool.txt
echo "\$ mv something newplace"
mv something newplace
echo "\$ ls newplace"
ls newplace

echo "##### 4.9 VER CONTENIDO: less, more, cat #####"
echo "\$ printf 'linea 1\\nlinea 2\\nlinea 3\\n' > demo.txt"
printf 'linea 1\nlinea 2\nlinea 3\n' > demo.txt
echo "--- cat demo.txt (vuelca todo de una vez) ---"
cat demo.txt
echo "--- more demo.txt (paginador que solo avanza hacia adelante) ---"
cat demo.txt | (more || true)
echo "--- less demo.txt (paginador interactivo: adelante/atras, busqueda, salir con 'q') ---"
echo "(less abre control directo de la terminal, por eso no se ejecuta dentro de este script automatizado; se usa en vivo durante la sustentacion escribiendo: less demo.txt)"

echo "##### 4.10 ELIMINAR ARCHIVOS Y DIRECTORIOS (rm) #####"
echo "\$ rm uncool.txt"
rm uncool.txt
echo "\$ ls"
ls
echo "\$ rm iamcool.txt neat.txt demo.txt"
rm iamcool.txt neat.txt demo.txt
echo "\$ ls"
ls
echo "\$ rm -rf newplace"
rm -rf newplace
echo "\$ ls"
ls
echo "\$ rm -rf temp i"
rm -rf temp i
echo "\$ ls"
ls

echo "##### REFERENCIA RAPIDA ADICIONAL #####"
echo "\$ uname -a"
uname -a
echo "\$ df -h"
df -h | head -6
echo "\$ free -h"
free -h
echo "\$ ps aux | head -5"
ps aux | head -5
echo "\$ grep root /etc/passwd"
grep root /etc/passwd
echo "\$ touch permisos.txt && chmod 700 permisos.txt && ls -l permisos.txt"
touch permisos.txt
chmod 700 permisos.txt
ls -l permisos.txt
rm permisos.txt

echo "##### 4.11 SALIR DE LA TERMINAL #####"
echo "\$ exit   (cierra la sesion SSH, no se ejecuta aqui para no cortar el script)"

echo "##### TALLER COMPLETADO #####"
