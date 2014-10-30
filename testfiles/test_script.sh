#!/bin/bash 

#Run the Testsuites

echo "Going to the folder which contains the automated test suites and test cases "
cd ./TESTSUITES/

echo "The following test suites are currently present:"
echo "1)notebook_naming"
echo "2)run_all" 
echo "3)advanced_dropdown_options"
echo "4)deleting_notebook" 
echo "5)history_versions" 
echo "6)login_logout" 
echo "7)markdown_R_cells" 
echo "8)shareable_link"
echo "9)comments" 
echo "10)login_logout" 
echo "11)other_functionalities" 
echo "12)python_cells" 
echo "13)saving_contents" 
echo "14)search" 
echo "15)sessions_nd_help" 
echo "16)star_count" 
echo "17)all"
     
#Fetch the parameters required to run the desired testsuite
echo "Please enter all the required parameters"
read -ep "Enter testsuite name: " testsuite
read -ep "Enter github username: " username
read -ep "Enter github password: " -s password
read -ep "Enter rcloud login url: " url

#the following command runs the desired test suite headlessly
if [[ -n "$testsuite" && -n "$username" && -n "$password" && -n "$url" ]];then
xvfb-run -a casperjs test --engine=slimerjs "$testsuite"/ --username="$username" --password="$password" --url="$url" --xunit=./testreports/report.xml
else
	echo "Please run the script again and enter all the required parameters"
fi
