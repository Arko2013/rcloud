/*The following functions are present :
 >login to Github and RCloud
 >create a new notebook
 >verify if RCloud edit.html page has got loaded properly
 >Add a new cell using + icon of prompt cell
 >Add contents to the FIRST cell and then execute it using run option
 >Run all the cells
 >Fork a notebook
 >open Advanced div
 >count the number of Notebooks and delete the newly created notebook from Notebooks I Starred list
 >getting notebook title
 >view.html link verifications
 >checking if notebook is starred
 >Check whether a notebook is present in Notebooks I Starred list
 >Check whether a notebook is present in People I Starred list
 >Check whether a notebook is present in All Notebooks list
 >Enter comments
 >Search Elements
 */


var casper = require("casper").create();

//login to Github and RCloud
exports.login = function (casper, github_username, github_password, rcloud_url) {
    return casper
        .then(function () {
            if (casper.getTitle().match(/GitHub/)) {

                casper.viewport(1024, 768).then(function () {
                    this.test.assertTitleMatch(/GitHub/, "Github page has been loaded");
                    console.log("Login into GitHub with supplied username and password");
                    this.sendKeys('#login_field', github_username);
                    this.sendKeys('#password', github_password);
                    this.click({type: 'css', path: '#login > form > div.auth-form-body > input.button'});
                });

                casper.viewport(1024, 768).then(function () {
                    if (this.getTitle().match(/GitHub/)) {

                        this.click({type: 'css', path: 'html body.logged_in div.wrapper div.site div#site-container.context-loader-container div.setup-wrapper div.setup-main form p button.button'});
                        console.log("Github Authorization completed");

                    }
                    else {
                        casper.viewport(1024, 768).then(function () {
                            this.echo("The page title: " + this.getTitle());
                            console.log("RCloud Home page loaded");
                        });
                    }
                });

            }
            else {
                casper.viewport(1024, 768).then(function () {
                    this.test.assertTitleMatch(/RCloud/, 'RCloud Home page already loaded');
                });
            }
        });
}

//create a new notebook
exports.create_notebook = function (casper) {
    return casper
        .then(function () {
            var z = casper.evaluate(function () {
                $('#new-notebook').click();

            });
            this.echo("New Notebook created");
            this.wait(9000);
        });
};

//verify if RCloud edit.html page has got loaded properly
exports.validation = function (casper) {
    return casper
        .then(function () {
            this.test.assertExists(
                {type: 'css', path: '.icon-share' },
                'the element Shareable Link exists'
            );
            this.test.assertExists(
                {type: 'css', path: "#rcloud-logout" },
                'Logout option exists'
            );
        });
};

//Add a new cell using + icon of prompt cell
exports.addnewcell = function (casper) {
    return casper
        .then(function () {
            this.test.assertTruthy(this.click({type: 'css', path: "#insert-new-cell .icon-plus"}), "created new cell");
            this.wait(7000);
        });
};

//Add contents to the FIRST cell and then execute it using run option
exports.addcontentstocell = function (casper, input_code) {
    return casper
        .then(function () {
            this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', input_code);
            this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//xpath for executing the contents
            this.echo("executed contents of First cell");
            this.wait(6000);
        });

};

//Run all the cells
exports.runall = function (casper) {
    return casper
        .then(function () {
            var z = casper.evaluate(function () {
                $('#run-notebook .icon-play').click();

            });
            this.wait(10000);
            console.log('Run-all button is clicked to execute the pre-executed cell');

        });
};

//Fork a notebook 
exports.fork = function (casper) {
    return casper
        .then(function () {
            this.test.assertExists({type: 'css', path: '.icon-code-fork'}, 'Fork option exists');
            this.test.assertTruthy(this.click({type: 'css', path: '.icon-code-fork'}), 'Fork option clicked');
            this.wait(9000);
        });
};

//open Advanced div
exports.open_advanceddiv = function (casper) {
    return casper
        .then(function () {
            this.click({type: 'xpath', path: '/html/body/div/div/div[2]/ul[2]/li/a/b'}, 'Advanced div opened');
            this.wait(6000);
        });
};

//delete the newly created notebook
exports.delete_notebooksIstarred = function (casper) {
    return casper
        .then(function () {
            var x = require('casper').selectXPath;
            var flag = 0;//to check if notebook has been found
            var counter = 0;//counts the number of notebooks
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter + ') > div:nth-child(1) > span:nth-child(1)'}));
            counter = counter - 1;
            var title = this.fetchText({type: 'css', path: '#notebook-title'});
            for (var i = 1; i <= counter; i++) {

                this.wait(2000);
                var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
                if (temp == title) {
                    flag = 1;
                    break;
                }
            }//for closes
            this.test.assertEquals(flag, 1, "Located the newly created notebook and deleting it");
            //deleting the notebook
            this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(4) > i:nth-child(1)'});
            this.echo("Deleted the newly created notebook with title " + title);
        });
};

//getting notebook title
exports.notebookname = function (casper) {
    return casper.fetchText({type: 'css', path: '#notebook-title'});

};

//view.html link verifications
exports.viewhtml = function (casper) {
    return casper
        .then(function () {
            this.test.assertUrlMatch(/view.html/, 'view.html page for given user loaded');
            //verify that only output div is visible and editable icon exists which proves that the notebook is currently not in Editable
            //form
            this.test.assertVisible({type: 'css', path: '#edit-notebook > i:nth-child(1)' }, 'Edit option visible which proves that notebook currently is uneditable');
            this.test.assertVisible({type: 'css', path: 'div:nth-child(3) > div:nth-child(2) > pre:nth-child(2) > code:nth-child(1)'}, 'output div visible');
            this.test.assertNotVisible({type: 'css', path: 'div:nth-child(3) > div:nth-child(2) > pre:nth-child(1) > code:nth-child(1)'}, 'source code not visible');
        });
};

//checking if notebook is starred
exports.checkstarred = function (casper) {
    return casper
        .then(function () {
            var starcount = this.fetchText({type: 'css', path: '#curr-star-count'});
            if (starcount == 1) {
                this.echo("Notebook is starred");
            }
            else {
                this.echo("Notebook is unstarred");
            }
        });
};

//Check whether a notebook is present in Notebooks I Starred list
exports.notebooksIstarred = function (casper) {
    return casper
        .then(function () {
            var counter1 = 0;//count the number of notebooks
            var title = this.fetchText({type: 'css', path: '#notebook-title'});
            do
            {
                counter1 = counter1 + 1;
                this.wait(2000);
            } while (casper.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter1 + ') > div:nth-child(1) > span:nth-child(1)'}));
            counter1 = counter1 - 1;
            this.echo("number of notebooks under Notebooks I Starred list:" + counter1);
            var flag = 0;//flag variable to test if the Notebook was found in the div
            var starcount = 0;//checking the starcount of the notebook under this div
            for (var i = 1; i <= counter1; i++) {
                this.wait(2000);
                var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
                //this.echo(temp);
                if (temp == title) {
                    flag = 1;
                    this.echo("Found notebook " + title + " in Notebooks I Starred list");
                    starcount = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > sub:nth-child(2)'});
                    break;
                }
            }//for closes
            if (flag == 1) {
                this.test.assertEquals(flag, 1, "Notebook with title " + title + " is PRESENT under Notebooks I Starred list with star count = " + starcount);
            }
            else {
                this.test.assertEquals(flag, 0, "Notebook with title " + title + " is ABSENT under Notebooks I Starred list with star count = " + starcount);
            }

        });
};

//Check whether a notebook is present in People I Starred list
exports.peopleIstarred = function (casper) {
    return casper
        .then(function () {

            var counter2 = 0;//count the number of notebooks
            var title = this.fetchText({type: 'css', path: '#notebook-title'});
            do
            {
                counter2 = counter2 + 1;
                //this.wait(2000);
            } while (casper.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter2 + ') > div:nth-child(1) > span:nth-child(1)'}));
            counter2 = counter2 - 1;
            this.echo("number of notebooks under People I Starred list:" + counter2);
            var flag = 0;//flag variable to test if the Notebook was found in the div
            var starcount = 0;//checking the starcount of the notebook under this div
            for (var i = 1; i <= counter2; i++) {
                //this.wait(2000);
                var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
                //this.echo(temp);
                if (temp == title) {
                    flag = 1;
                    this.echo("Found notebook " + title + " in People I Starred list");
                    starcount = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > sub:nth-child(2)'});
                    break;
                }
            }//for closes
            if (flag == 1) {
                this.test.assertEquals(flag, 1, "Notebook with title " + title + " is PRESENT under People I Starred list with star count = " + starcount);
            }
            else {
                this.test.assertEquals(flag, 0, "Notebook with title " + title + " is ABSENT under People I Starred list with star count = " + starcount);
            }
        });
};

//Check whether a notebook is present in All Notebooks list
exports.allnotebooks = function (casper) {
    return casper
        .then(function () {

            var counter3 = 0;//count the number of notebooks
            var title = this.fetchText({type: 'css', path: '#notebook-title'});
            do
            {
                counter3 = counter3 + 1;
                //this.wait(2000);
            } while (casper.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter3 + ') > div:nth-child(1) > span:nth-child(1)'}));
            counter3 = counter3 - 1;
            this.echo("number of notebooks under My Notebook of All Notebooks list:" + counter3);
            var flag = 0;//flag variable to test if the Notebook was found in the div
            var starcount = 0;//checking the starcount of the notebook under this div
            for (var i = 1; i <= counter3; i++) {
                //this.wait(2000);
                var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
                //this.echo(temp);
                if (temp == title) {
                    flag = 1;
                    this.echo("Found notebook " + title + " in All notebooks list");
                    starcount = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > sub:nth-child(2)'});
                    break;
                }
            }//for closes
            if (flag == 1) {
                this.test.assertEquals(flag, 1, "Notebook with title " + title + " is PRESENT under All Notebooks list with star count = " + starcount);
            }
            else {
                this.test.assertEquals(flag, 0, "Notebook with title " + title + " is ABSENT under All Notebooks list with star count = " + starcount);
            }
        });
};

//Enter comments
exports.comments = function (casper, comment) {
    return casper
        .then(function () {
            if (this.visible('#comments-wrapper')) {
                this.echo('Comment div is open');
                this.wait(5000);

            }
            else {
                this.echo('Comment div is not open,hence opening it');
                this.wait(5000);
                var z = casper.evaluate(function () {
                    $('.icon-comments').click();
                });
                this.wait(5000);
            }
            this.sendKeys('#comment-entry-body', comment);
            this.wait(3000);
            this.test.assertTruthy(this.click({type: 'css', path: '#comment-submit'}), 'comment entered successfully');
        });
};

//Search elements
exports.search = function (casper, item, combo) {
    return casper
        .then(function () {
            var x = require('casper').selectXPath;
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
                this.sendKeys('#input-text-search', item);
                this.wait(6000);
                var z = casper.evaluate(function () {
                    $('.icon-search').click();
                });
            });
            var counter = 0;
            casper.wait(5000);
            //counting number of Search results
            casper.then(function () {
                do
                {
                    counter = counter + 1;
                    this.wait(2000);
                } while (this.visible(x('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
                counter = counter - 1;
                this.echo("number of search results:" + counter);
            });
            //verify that the searched item is found in the local user's div
            casper.viewport(1366, 768).then(function () {
                //this.echo("Combo= "+combo);
                var flag = 0;//to check if searched item has been found
                for (var i = 1; i <= counter; i++) {
                    this.wait(5000);
                    var result = this.fetchText(x('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr/td/a'));
                    //this.echo(result);
                    if (result == combo) {
                        var temp = this.fetchText(x('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + i + ']/tbody/tr[2]/td/div/table/tbody/tr[2]/td/table/tbody/tr/td[2]/code'));
                        if (temp == item) {
                            flag = 1;
                            break;
                        }
                    }//outer if closes
                }//for closes
                this.test.assertEquals(flag, 1, "Searched item has been found");
            });//function closes
        });
};		