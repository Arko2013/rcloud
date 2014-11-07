#!/bin/bash 

# Install the testing bed (Slimerjs,Casperjs and Phantomjs ) if not already installed
# Installation of Phantomjs
if [ -f /usr/local/bin/phantomjs ];
then
   echo "Phantomjs exist."
else
   echo "Phantomjs does not exist. Hence installing it"
   checke=$(uname -m) 
   echo $checke
   teste="i686"
   echo $teste
   if [[ "$teste"="$checke" ]];
	then
		echo "System is 32 bit"
		echo "Installing Phantomjs for 32 bit"
		read -ep "Enter the System name: " name
		read -ep "Enter the Folder name name: " dir_name
		cd
		mkdir ${dir_name}
		cd ${dir_name}
		wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-i686.tar.bz2
		tar -xvjf phantomjs-1.9.8-linux-i686.tar.bz2 
		sudo ln -s /home/${name}/${dir_name}/phantomjs-1.9.8-linux-i686 /usr/local/share/phantomjs 
		sudo ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/local/bin/phantomjs  
		echo "Phantomjs is installed successfully"
		phantomjs --version

	else
		echo "System is 64 bit"
		echo "Installing Phantomjs for 64 bit"
		read -ep "Enter the System name: " name
		read -ep "Enter the Folder name name: " dir_name
		cd
		mkdir ${dir_name}
		cd ${dir_name}
		wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2
		tar -xvjf phantomjs-1.9.8-linux-x86_64.tar.bz2
		sudo ln -s /home/${name}/${dir_name}/phantomjs-1.9.8-linux-x86_64 /usr/local/share/phantomjs 
		sudo ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/local/bin/phantomjs  
		echo "Phantomjs is installed successfully"
		phantomjs --version

   fi
fi   
# Instalaltion of Slimerjs
if [ -f /usr/local/bin/slimerjs ];
then
   echo "Slimerjs exist."
else
   	
   echo "Slimerjs does not exist. Hence installing it"
	git clone https://github.com/Arko2013/slimerjs.git
   sudo ln -s /home/${name}/${dir_name}/slimerjs /usr/local/share/slimerjs
   sudo ln -s /usr/local/share/slimerjs/src/slimerjs /usr/local/bin/slimerjs  
   echo "Slimerjs is installed successfully"
   slimerjs --version 
fi

# Installation of Casperjs
if [ -f /usr/local/bin/casperjs ];
then
   echo "Casperjs exist."
else
	echo "Casperjs does not exist. Hence installing it"
	git clone https://github.com/n1k0/casperjs.git
   	cd casperjs
   	sudo ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
   	echo "Casperjs is installed successfully"
   	casperjs --version 
fi


