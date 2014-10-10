/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showning that when a cell from a notebook is deleted from Rcloud,
 the respective content should be deleted from Search Results. This is indicated by decrease in Number of Search Results

 */

//Begin Tests

casper.test.begin(" Search after deleting a cell from a notebook", 8, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = 'kangaroointhezoo';//item to be searched
    var title;//store notebook title
    var combo;//store author+notebook title		

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
    });

    //Change the language of prompt cell to Markdown cell. Select 1 for markdown and 2 for python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 1;
            return true;
        });
    });

    //Added a new cell
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', item);
        this.wait(3000);
        this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//css for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    casper.viewport(1024, 768).then(function () {
        functions.search(casper, item, combo);
    });

    //counting number of Search results
    var initialcount = 0;//stores initial count of search results
    casper.then(function () {
        do
        {
            initialcount = initialcount + 1;
            this.wait(2000);
        } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + initialcount + ']/tbody/tr/td/a')));
        initialcount = initialcount - 1;
    });

    //Delete the created cell
    casper.viewport(1366, 768).then(function () {
        this.test.assertTruthy(this.click({type: 'css', path: '.icon-trash'}), "Confirmed that cell has been deleted successfully");
        this.test.assertDoesntExist({type: 'css', path: '.r-result-div'}, "Confirmed that R cell no longer exists");
    });

    //searching the item again
    casper.then(function () {
        this.wait(4000);
        this.click({type: 'css', path: '#search-form > button:nth-child(2)'});
    });

    //counting number of Search results again to verify that the number of search results have reduced
    var finalcount = 0;//stores final count of search results
    casper.then(function () {
        do
        {
            finalcount = finalcount + 1;
            this.wait(2000);
        } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + finalcount + ']/tbody/tr/td/a')));
        finalcount = finalcount - 1;
        this.test.assertNotEquals(initialcount - 1, finalcount, "Confirmed that deleting the cell has resulted in reducing the number of Search results");
    });

    casper.run(function () {
        test.done();
    });
});
