const fs = require('fs');
const path = require('path');
const fileUtil = require('./fileUtil');
const routeHandler = {};
const helper = require('./helper');

const updateBookAmount = (updateType, id, callback) => {
    const filePath = path.join("books", id + '.json');
    fs.open(filePath, 'r+', (err, fd) => {
        console.log("FD", fd);
        if (!err) {
            fs.readFile(fd, 'utf-8', (err, data) => {
                if (!err) {
                    const parsedData = JSON.parse(data);
                    if (updateType == 'inc') {
                        parsedData.amount = parsedData.amount + 1;
                    } else if (updateType == 'dec') {
                        if (parsedData.amount == 0) {
                            callback({message: 'book not available'});
                        } else {
                            parsedData.amount = parsedData.amount - 1;
                        }
                    }
                    
                    // write with filename instead of file descriptor to be assured of total rewrite
                    fs.writeFile(filePath, JSON.stringify(parsedData), err => {
                        if (!err) {
                            fs.close(fd, err => {
                                if (!err) {
                                    callback(false);   
                                } else {
                                    callback(err);
                                }
                            });
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback(err);
                }
    
            });
        } else {
            callback(err);
        }
    });
}

const findUserByToken = (token) => {
    const dir = 'users';
    const files = fs.readdirSync(dir);
    const expectedValue = {userfile: null, data: null};
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileDescriptor = fs.openSync(filePath, 'r+');
        const data = fs.readFileSync(fileDescriptor, 'utf-8');
        const parsedData = JSON.parse(data);
        if (parsedData.secureId == token) {
            expectedValue.userfile = file;
            expectedValue.data = parsedData;
        }
        
    });
    return expectedValue;
};

const addBorrowedBookToUser = (token, bookId) => {};

routeHandler.Books = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put", "delete"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._books[data.method](data, callback);
    } else {
        callback(405);
    }
};

routeHandler.BorrowBook = (data, callback) => {
    const acceptableHeaders = ["post"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._borrowBook[data.method](data, callback);
    } else {
        callback(405);
    }
};

routeHandler._borrowBook = {};

routeHandler._borrowBook.post = (data, callback) => {
    const token = typeof data.payload.token == 'string' && data.payload.token.length == 256 ? data.payload.token : null;
    const bookId = typeof data.payload.book == 'string' && data.payload.book ? data.payload.book : null;
    console.log(token, bookId);
    
    if (token, bookId) {
        fs.readdir('users', (err, files) => {
            files.forEach(file => {
                console.log("ForEach being called");
                fs.readFile(path.join('users', file), 'utf-8', (err, data) => {
                    const readData = JSON.parse(data);
                    if (readData.secureId == token) {
                        // Decrement book count and update book.
                        updateBookAmount('dec', bookId, err => {
                            if (!err) {
                                const user = findUserByToken(token);
                                if (user.data && user.userfile) {
                                    if (!user.data.book) {
                                        user.data.book = bookId;
                                        fs.open(path.join('users', user.userfile), 'r+', (err, fd) => {
                                            if (!err) {
                                                callback(200, {message: 'book successfully borrowed'});
                                            } else {
                                                callback(500, {message: err});
                                            }
                                        });
                                    } else {
                                        callback(400, {message: `user already has book with id: ${user.data.book}`});
                                    }
                                } else {
                                    callback(400, {message: 'error finding user'});
                                }
                            } else {
                                callback(500, {message: err});
                            }
                        });
                    }
                });
            });
        });
    } else {
        callback(400, {message: 'incomplete parameters'});
    }
}

//main book route object
routeHandler._books = {};

//Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
    //validate that all required fields are filled out
    var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    var price = typeof(data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    var author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    var amount = typeof data.payload.amount == 'string' && !isNaN(parseInt(data.payload.amount)) ? data.payload.amount : false;
    var token = typeof data.payload.token == 'string' ? data.payload.token : null;
    console.log(name, price, author, publisher, amount, token);
    if(name && price && author && publisher && amount && token){
        const user = findUserByToken(token);
        if (!(user.data.isAdmin == true)) {
            callback(400, {message: "only admins can add books"});
        } else {
            console.log("Handling book posting valid values");
            const fileName = helper.generateRandomString(30);
            fileUtil.create('books', fileName, data.payload, (err) => {
                if (!err) {
                    callback(200, { message: "book added successfully", data: null });
                } else {
                    callback(400, { message: "could add book" });
                }
            });
        }
    }
};
//Get route -- for geting a book
routeHandler._books.get = (data, callback) => {
    if (data.query.name) {
        fileUtil.read('books', data.query.name, (err, data) => {
            if (!err && data) {
                callback(200, { message: 'book retrieved', data: data });
            } else {
                callback(404, { err: err, data: data, message: 'could not retrieve book' });
            }
        });
    } else {
        fileUtil.readAll("books", (files) => {
            callback(404, { message: 'book not found', data: null, books: files });
        });
    }
};
//Put route -- for updating a book
routeHandler._books.put = (data, callback) => {
    if (data.query.name) {
        fileUtil.update('books', data.query.name,data.payload,  (err) => {
            if (!err) {
                callback(200, {message : 'book updated successfully'})
            }else{
                callback(400, {err : err, data : null, message : 'could not update book'});
            }
        });
    } else {
        callback(404, { message: 'book not found' });
    }
};
//Delete route -- for deleting a book
routeHandler._books.delete = (data, callback) => {
    if(data.query.name){
        fileUtil.delete('books', data.query.name, (err) => {
            if(!err){   
                callback(200, {message : 'book deleted successfully'});
            }else{
                callback(400, {err : err, message : 'could not delete book'});
            }
        })
    }else{
        callback(404, {message : 'book not found'});
    }
 };
 
 
 routeHandler.CreateUser = (data, callback) => {
     const acceptableHeaders = ["post"];
     if (acceptableHeaders.indexOf(data.method) > -1) {
         routeHandler._createUser[data.method](data, callback);
     } else {
         callback(405);
     }
 };


routeHandler.User = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put", "delete"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._user[data.method](data, callback);
    } else {
        callback(405);
    }
};

routeHandler._user = {};
routeHandler._createUser = {};

// create a user
routeHandler._createUser.post = (data, callback) => {
    if (data.payload.username && data.payload.password, data.payload.isAdmin) {
        fileUtil.create("users", data.payload.username, {secureId: null, ...data.payload}, err => {
            if (!err) {
                callback(200, {message: "user created successfully"});
            } else {
                callback(500, {message: err});
            }
        });
    }
};

// Sign in a user
routeHandler._user.post = (data, callback) => {
    if (data.payload.username && data.payload.password) {
        fileUtil.read("users", data.payload.username, (err, obj) => {
            if (!err) {
                if (data.payload.password == obj.password) {
                    const secureId = helper.generateRandomString(256);
                    obj.secureId = secureId;
                    fileUtil.userUpdate("users", data.payload.username, obj, err => {
                        if (!err) {
                            callback(200, {message: "logged in successfully", secureId});
                        } else {
                            callback(405, {message: err});
                        }
                    });
                } else {
                    callback(405, {message: "incorrect username or password"});
                }
            } else {
                callback(405, {message: err});
            }
        });
    } else {
        callback(405, {message: "missing parameters"});
    }
};


routeHandler.ping = (data, callback) => {
    callback(200, { response: "server is live" });
};
routeHandler.notfound = (data, callback) => {
    callback(404, { response: 'not found' });
};

module.exports = routeHandler;
