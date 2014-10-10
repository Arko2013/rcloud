/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that when multiple cells from a notebook are modified from Rcloud, the respective
 content should be modified from search Results


 */

//Begin Tests

casper.test.begin(" Edit multiple cells from a notebook", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item1 = 'inthezoo';
    var item2 = 'kangaroo';
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

    //Add 2 markdown cells and execute contents
    casper.then(function () {
        functions.addnewcell(casper);
        casper.viewport(1366, 768).then(function () {
            this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", item1);
            this.click({type: 'xpath', path: '/html/body/div[2]/div/div[2]/div/div/div/div/div/table/td/span/i'})
            this.wait(5000);
            this.echo("executed contents of first cell");
        });
    });

    // Add another markdown cell and execute contents
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", item1);
        this.click({type: 'xpath', path: '/html/body/div[2]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'})
        this.wait(5000);
        this.echo("executed contents of second cell");

    });

    //search the results
    casper.then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', item1);
            this.wait(6000);
            this.click({type: 'css', path: '#search-form > button:nth-child(2)'});
        });
        var counter = 0;
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            var flag = 0;//to check if searched item has been found
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                if (result == combo) {
                    var result1 = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr[2]/td/div/table/tbody/tr[2]/td/table/tbody/tr/td[2]/code'));
                    var result2 = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr[2]/td/div/table/tbody/tr[4]/td/table/tbody/tr/td[2]/code'));
                    if (result1 == item1 && result2 == item1) {
                        flag = 1;
                        break;
                    }
                }//outer if closes
            }//for closes
            this.test.assertEquals(flag, 1, "Searched item has been found for both cells");
        });//function closes
    });

    //reloading the page so that both the cells are in executable form
    casper.viewport(1366, 768).then(function () {
        this.reload(function () {
            this.echo("loaded again");
        });
        this.wait(9000);
    });

    //modify content of the two cells and execute
    casper.viewport(1366, 768).then(function () {
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", item2);
        this.wait(2000);
        this.click({type: 'xpath', path: '/html/body/div[2]/div/div[2]/div/div/div/div/div/table/td/span/i'})
        this.wait(7000);
        this.echo("executed the modified contents of first cell");
    });

    //changing the second R cell to editable form
    casper.viewport(1366, 768).then(function () {
        //running the cell before executing it so that we get access to the second cell
        this.click(x('/html/body/div[2]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'));
        this.wait(7000);
        this.thenClick({type: 'xpath', path: '/html/body/div[2]/div/div[2]/div/div/div[2]/div/div/table/td[2]/span/i'});
        this.wait(5000);
    });

    //Editing the code of second R cell
    casper.viewport(1366, 768).then(function () {
        //this.sendKeys(x('/html/body/div[2]/div/div[2]/div/div/div[2]/div[3]/div/div/div[2]/div/div[3]/div/div'),item2);
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", item2);
        this.wait(3000);
        this.click(x('/html/body/div[2]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'));
        this.wait(5000);
    });

    //search the modified results
    casper.then(function () {
        var temp = item2 + item1;
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', temp);
            this.wait(6000);
            this.click({type: 'css', path: '#search-form > button:nth-child(2)'});
        });
        var counter = 0;
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            var flag = 0;//to check if searched item has been found
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                //this.echo(result);
                if (result == combo) {
                    var result1 = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr[2]/td/div/table/tbody/tr[2]/td/table/tbody/tr/td[2]/code'));
                    var result2 = this.fetchText(x('/html/body/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr[2]/td/div/table/tbody/tr[4]/td/table/tbody/tr/td[2]/code'));
                    if (result1 == temp && result2 == temp) {
                        flag = 1;
                        break;
                    }
                }//outer if closes
            }//for closes
            this.test.assertEquals(flag, 1, "Modified searched item has been found for both cells");
        });//function closes
    });

    casper.run(function () {
        test.done();
    });
});
