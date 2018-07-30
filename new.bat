@echo off
md %1
copy _new\* %1\*
n.bat %1\source.js