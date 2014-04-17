
/**************************************************************************************************
How to install and run your program
***************************************************************************************************/

You can run the program by double clicking the "starwars.exe" file located in this folder.


/**************************************************************************************************
How to compile your program: What are the link libraries required, what GPU do you assume, etc.
***************************************************************************************************/

Link libraries required:
FreeGlut, GLEW and GLTools.

GPU requirements:
Your GPU should be capable of running OpenGL 3.0 (GLSL 1.3). 

This program will only run on Windows OS. Only the default resolution of 800x400 is supported. You 
may experience unexpected behaviour using a different resolution. 


/**************************************************************************************************
A brief users guide, i.e., what do the keys/mouse buttons do, etc.
***************************************************************************************************/

Keyboard:

'a' : Move Left
'd' : Move Right
's' : Use Shield
'r' : Skip Animation / Restart Game
'1' : Easy Mode
'2' : Normal Mode
'3' : Hard Mode
'4' : Insane Mode. Warning: This mode IS impossible.

Mouse:

Use the mouse to aim your laser. Press the left key to fire. Press and hold the left key to 
continuously fire.


/**************************************************************************************************
Pointers to relevant papers or online resources that helped you during the development of your code.
***************************************************************************************************/

These online resources have helped with my development:
Starwars fonts for the opening word crawl
http://www.theforce.net/fanfilms/postproduction/crawl/opening.asp
Starwars logo for the opening
http://www.viscombelfast.com/interactive/2010/10/star-wander/winnie-shek/
Enemy unit 3D models
http://www.scifi3d.com/
Deathstar 3D model
http://gfx-3d-model.blogspot.com/2008/07/deathstar.html
Explosion sound effects
http://www.mediacollege.com/downloads/sound-effects/explosion/
Victory sound
http://www.allmusiclibrary.com/free_sound_effects.php
Intro music, fly by sound and Death Star music from Star Wars Movies
HW3 and HW4 code from CS175.
Inspired by the Star Wars Movies I-VI


/**************************************************************************************************
List of all source files of your project and what they contain, including acknowledgement of any 
source code / libraries not written by you.
***************************************************************************************************/

C++ source files and header files:

Camera.cpp*
Camera.h*
custom.h
laser.cpp
list.cpp*
list.h*
main.cpp^
material.cpp*
material.h*
Matrix.h*
model3d.cpp*
model3d.h*
obj_parser.cpp*
obj_parser.h*
objLoader.cpp*
objLoader.h*
shaders.cpp*
shaders.h*
string_extra.cpp*
string_extra.h*
trackball.c*
trackball.h*
unit.cpp
vector.h*
vpmath.h*

All shader files (**.frag and **.vert)*

Libraries Used and not written by me:

FreeGlut 
GLEW 
GLTools 

* source code / shaders provided by CS175 HW3/HW4 skeleton code or solutions.
^ partially provided skeleton code from CS175 HW3/HW4.

files created by me:

main.cpp
This file contains the main program logic.

custom.h
This header file contains declarions of three classes, Laser class, Unit class and Explosion class.
These are used to create laser objects, unit objects and explosion objects in the main.cpp.

laser.cpp
Implementation of the Laser class. Provides a constructor for the laser. Also provides the Move method
that moves the laser step by step every time the method is called.

unit.cpp
Impelmentation of the Unit class. Provides the constructor for the laser. Also provides the animate
method that moves units; setCenter method to set the center of the unit; and testCollision method
that tests if a given point is within the unit's bound radius.

/**************************************************************************************************
Any license headers, acknowledgements, etc. that came with software
***************************************************************************************************/

Achnowledgements:
CS175 course staff for the codes from CS175 HW3 and HW4.
Moritz provided the pick function that maps 2D mouse click to a point in 3D.