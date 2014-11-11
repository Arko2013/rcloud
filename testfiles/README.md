In a desired directory,hereby to be referred as <path> ,create a folder named "TESTING" . In the installation steps mentioned below, we will refer to this folder(<path>/TESTING) for all installations 

DEPENDENCIES:
---------

* Latest version of Firefox should be installed. Slimerjs supports only Firefox as of now
* Python 2.6 or higher should be present

INSTALLATION OF PHANTOMJS:
---------

```sh
Following steps needs to be followed
  - Download the 32-bit/64-bit phantomjs tar.bz2 file from the link :          http://phantomjs.org/download.html
  - Extract the file phantomjs using : 
    tar -xvjf phantomjs-1.9.7-linux-i686.tar.bz2 (for 32 bit)
    tar -xvjf phantomjs-1.9.7-linux-x86_64.tar.bz2 (for 64 bit)
  - sudo ln -s <path>/TESTING/phantomjs-1.9.7-linux-i686 /usr/local/share/phantomjs
  - sudo ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/local/bin/phantomjs
  - To ensure that Phantomjs has been installed properly, check the version using :
    phantomjs --version
```

INSTALLATION OF SLIMERJS:
---------

```sh
Following steps needs to be followed
  - wget http://download.slimerjs.org/releases/0.9.3/slimerjs-0.9.3-linux-x86_64.tar ( for 64-bit system)
  - wget http://download.slimerjs.org/releases/0.9.3/slimerjs-0.9.3-linux-x86_64.tar ( for 32-bit system)
  - sudo tar -xvjf slimerjs-0.9.3-linux-x86_64.tar ( for 64-bit system)
  - tar -xvjf slimerjs-0.9.3-linux-i686.tar.bz2 ( for 32-bit system)
  - sudo mv slimerjs-0.9.3 slimerjs 
  - sudo ln -s <path>/TESTING/slimerjs /usr/local/share/slimerjs
  - sudo ln -s /usr/local/share/slimerjs/slimerjs /usr/local/bin/slimerjs
  - To ensure that Slimerjs has been installed properly, check the version using :
    slimerjs --version 

You can also refer to the links for further information :
  - https://github.com/laurentj/slimerjs
  - http://slimerjs.org/download.html  
```

INSTALLATION OF CASPERJS:
---------

```sh
Following steps needs to be followed
  - Clone Casperjs from the following repository:
    git clone https://github.com/n1k0/casperjs.git
  - cd casperjs
  - sudo ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
  - To ensure that Casperjs has been installed properly, check the version using :
    casperjs --version 
  - For Headless Testing using Casperjs , install xvfb with the following command: :
    sudo apt-get install xvfb 
```

RUNNING A SAMPLE TESTSUITE
--------------

Let's say that you want to run a Testsuite named "demo_suite1" . A Testsuite basically consists of several test cases . For this , create a Testsuite folder and place the desired testcases inside this folder . 

##### For running the testsuite with UI, the command is :
casperjs test --engine=slimerjs demo_suite1/ --username=<github username> --password=<github password> --url=<RCloud login url> --xunit=reports/report1.xml

##### For running the testsuite headlessly, the command is :
xvfb-run -a casperjs test --engine=slimerjs demo_suite1/ --username=<github username> --password=<github password> --url=<RCloud login url> --xunit=reports/report1.xml


RUNNING A SAMPLE TESTCASE
--------------

Let's say that you want to run a Testcase named "testcase1.js" inside the Testsuite "demo_suite1" .  

##### For running the testcase with UI, the command is :
casperjs test --engine=slimerjs demo_suite1/testcase1.js --username=<github username> --password=<github password> --url=<RCloud login url> --xunit=reports/report1.xml

##### For running the testsuite headlessly, the command is :
xvfb-run -a casperjs test --engine=slimerjs demo_suite1/testcase1.js --username=<github username> --password=<github password> --url=<RCloud login url> --xunit=reports/report1.xml

After successful execution an xml report(say,report1.xml) for the testsuite will be generated inside the "reports" folder . The user can specify in this manner where to store the report of the automation tests .

##### Some necessary file descriptions :

* basicfunctions.js -> Contains a set of common functions(eg. login,validating if RCloud edit.html page has got loaded properly, creating a cell,etc.) which can be called by the testcases 
* xtranotebooksdelete.js -> A function that can be called any time ( just like calling any other testcase as mentioned on top ) for deleting the notebooks which might have got created during running a testsuite/testcase
* jquery-1.10.2 -> This file is required to be invoked so that jquery can be used while writing the test cases .

The above 3 functions have been kept inside the TESTSUITES folder so that they be called while running a Testsuite or an indivifual Testcase





