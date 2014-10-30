#!/bin/bash 

#Run the Testsuites

echo "Going to the folder which contains the automated test suite and related dependencies "
cd ./testfiles/TESTSUITES/
     
#Fetch the parameters required to run the testsuite
echo "Please enter all the required parameters"
read -ep "Enter the Report name : " report
read -ep "Enter rcloud login url: " url
read -ep "Do you want to run the test headlessly?(y/n) : " choice
read -ep "Enter github username: " username
read -ep "Enter github password: " -s password

#the following command runs the desired test suite headlessly or with UI acording to choice
if  [[ -n "$testsuite" && -n "$url" && -n "$choice" && -n "$username"  && -n "$password" ]]; 
then
	if  [[ "$choice" == "y" ]]; 
	then
		echo "Running headlessly"
		sudo xvfb-run -a casperjs test --engine=slimerjs testsuite/ --username="$username" --password="$password" --url="$url" --xunit=./testreports/${report}.xml
	else 
		echo "Running with UI"
		sudo casperjs test --engine=slimerjs testsuite/ --username="$username" --password="$password" --url="$url" --xunit=./testreports/${report}.xml
	fi 
else
	echo "Please run the script again and enter all the required parameters"
fi
