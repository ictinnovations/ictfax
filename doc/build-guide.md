### ICTFax BUILD GUIDE

In order to access **ICTFax** , there are some steps that should be followed.
* Remote Server
* Install Git
* Install NPM and Node
* Install Angular Cli
* Build Project
* Change Server

### 1. Remote Server

To build ICTFax on a remote server, a **remote connection** must be established by SSH.

Establishing this connection requires following steps:
 
* Type this command in terminal and enter the Password afterwards :

        ssh root@your.domain.tld

You are on the way of building project.

### 2. Install Git

Install git to clone the repository.
To install git and other dependencies use the following command:

        dnf install git make gcc-c++

For previous versions of OS i.e CentOS and Fedora21 use this command:

        yum install git make gcc-c++

Once the installation is complete , clone the repository using:

        git clone https://github.com/ictinnovations/ictfax ~/ictfax-gui     

Download the source code.

### 3. Install NPM and Node

For installation of npm following commands can be used:
         
            echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc. ~/.bashrc

make a new folder by :
         
              mkdir ~/local

install node:
          
         mkdir ~/node-latest-install
         cd ~/node-latest-install
         curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1./   configure --prefix=~/local
         make install

The last command installs all the npm and node files into a new directory, which might take some time.

### 3. Install Angular Cli

This software is built in Angular therefore Angular cli is required for working.
Angular cli will be installed by typing the following command in terminal:

        npm install -g @angular/cli
        

### 4. Change Server:
Replacing API_URL variable with **domain name or IP address of the server** will change server. For this navigate to `src>environments/environment.prod.ts `and open the **environment.prod.ts**
Find the following lines and make changes to these:

        API_URL: '/api',

replace these lines with the following ones:

         API_URL: 'http://your.domain.tld/api',


### 5. Build Project

Build the project, use the following commands for this purpose:

        cd ~/ictfax-gui
        npm install
        ng build --env=prod
        
Now you can manage **ICTFax** on the new server.

**Note** : If you want to change the API after build, then open the dist folder which is created after **ng build --env=prod** command, find the file **main.bundle.js** , open this file, and change the API_URL with the desired one.

