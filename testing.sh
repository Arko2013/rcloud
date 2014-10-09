#!/bin/bash 

#Run the Testsuites

echo "Going to the folder which contains the automated test suites and test cases "
cd ./automationtesting/TESTSUITES/ 

echo "The following test suites are currently present:"
echo "1)notebook_naming"
echo "2)run_all" 
echo "3)advanced_dropdown_options" 
echo "4)comments" 
echo "5)deleting_notebook" 
echo "6)history_versions" 
echo "7)login_logout" 
echo "8)markdown_R_cells" 
echo "9)other_functionalities" 
echo "10)python_cells" 
echo "11)saving_contents" 
echo "12)search" 
echo "13)sessions_nd_help" 
echo "14)shareable_link"
echo "15)star_count" 
echo "16)all_testcases"
     
#Fetch the parameters required to run the desired testsuite
echo "Please enter all the required parameters"
read -ep "Enter testsuite name: " testsuite
read -ep "Enter github username: " username
read -ep "Enter github password: " password
read -ep "Enter rcloud login url: " url

#the following command runs the desired test suite headlessly
if [[ -n "$testsuite" && -n "$username" && -n "$password" && -n "$url" ]];then
xvfb-run -a casperjs test --engine=slimerjs "$testsuite"/ --username="$username" --password="$password" --url="$url" --xunit=report.xml
else
	echo "Please run the script again and enter all the required parameters"
fi
