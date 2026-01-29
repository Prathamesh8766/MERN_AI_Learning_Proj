Important concepts:

#### 1> Middleware:



It is code that sits in the middle of something. It is a function that runs b/w two stages of a process.

In express, middleware runs b/w request and response.

In Mongoose, it runs b/w before or after a database operation.

In general, software systems, middleware sits b/w components and controls flow.



#### 2> Hooks:



It is provided by libraries/frameworks like Mongoose, React, Sequelize, etc. It is a special place where you are allowed to attach middleware. 

Example:

"Before saving data" is a hook, 

"After validating data" is a hook,

"Before sending a response" is a hook.



#### 3> Lifecycle:



Every object or request has a life:

Create -> processed -> stored -> destroyed. Hooks exist at lifecycle boundaries.



#### 4> Side-effect:



Middleware modifies data automatically.



#### 5> Implicit behaviour: 



Middleware runs automatically, which is great—but if you forget it exists, debugging becomes hard.



#### 7> Stateless and Stateful



A state means stored information about an ongoing interaction. If the server keeps some memory about you after one request and uses it for the next request, that server is stateful. If the server does not remember anything and treats every request as brand new, it is stateless.

Stateful:

In a stateful system, when you log in:

1) You send username and password
2) Server verifies them
3) Server creates a session
4) Session data is stored in memory or database
5) Server sends a session ID to the client (usually via cookies)
Now on every request:
1) Client sends session ID
2) Server looks up the session in memory/database
3) Server knows who you are
Here, the server is remembering you.
That memory is the state.
If the server restarts or the session store crashes → users are logged out

#### 8> Model: 



The model folder is for defining the schema of the database because in MongoDB, which is a NoSQL database that stores data in documents, the data is not structured. This is where the schema appears to fulfil the structured need for data for the project.



##### a> User.js: 



In this file, the model of the user is defined, such as what particular field the user needs.



import mongoose from "mongoose"                  // Mongoose is a library that connects the app to the MongoDB. 



const userSchema = new mongoose.Schema(         // This is how the schema is used; it defines the structure and rules of your data.

&nbsp; {

&nbsp;   username: {

&nbsp;     type: String,

&nbsp;     required: true,

&nbsp;     unique: true,

&nbsp;     trim: true,

&nbsp;     minlength: 3,

&nbsp;   },

&nbsp;   password: {

&nbsp;     type: String,

&nbsp;     required: true,

&nbsp;     minlength: 6,

&nbsp;    

&nbsp;   },

});

const User = mongoose.model("User", userSchema); 				        //Here the "User" is a collection name and userSchema is a schema. After this, User becomes a 												powerful object that you use everywhere in your app.



import bcrypt from "bcryptjs" 							       //It is a password-security library. Used to protect passwaods befroe they are stored in the 												database by hashing them. it only encrypts the pssword dicription is not possible. 

userSchema.pre("save", async function(){                                              //pre is document middleware and "save" is a hook

if(!this.password) return;                                                             //Here this refers to the document 

const salt = await bcrypt.genSalt(10);    					      //salt is a random string attached to the password .geSalt() generat it.

this.password = await bcrypt.hash(this.password, salt);

});



userSchema.methods.matchPassword = async function (enteredPassword) {     //matchPassword is user mad metthod which is used to matchpassword that match the password with the entered one.  

&nbsp; return await bcrypt.compare(enteredPassword, this.password);          //.compare method used to compare the entered password and the hashed password by taking out the salt from the hash, 

});						                           hashing the entered password, then comparing.



##### b> FlashCard.js

&nbsp; userId: {

&nbsp;     type: mongoose.Schema.Types.ObjectId,                              // here the userId is referring to a user.\_id. where "\_id" is the objectId, which isunique to each document.

&nbsp;     ref: "User",							// ref : this tells which collection "User"

&nbsp;     required: true,

&nbsp;   },

&nbsp; documentId: {

&nbsp;    type: mongoose.Schema.Type.ObjectId,

&nbsp;    ref: "Document",

&nbsp;    required: true,

&nbsp;   }

flashcardSchema.index({ userId: 1, documentId: 1 });                //An index is a database optimization structure. It makes queries faster. Using the userId, documentId the flashcards 									are searched, which is way faster. And 1 refers to ascending, -1 refers to descending. 



#### 9> Authentication



##### a> auth.js:



import jwt from "jsonwebtoken";            //A JWT is a self-contained identity proof. Instead of storing user sessions on the server, the server gives the client a token after login.

import User from "../model/User.js";

const export protect = async (req, res, next)=>{ 

&nbsp;	let token;

&nbsp;	if(req.header.authorization \&\& req.header.authorization.startWith("Bearer")){            //Bearer is an authentication scheme.

&nbsp;		token = req.header.authorization.split(" ").\[1]

&nbsp;		try{

&nbsp;			const decoder = await jwt.verifiy(token, process.env.JWT\_SECRET);   //JWT\_SECRET is used for bout creation jwt and verification of jwt.

&nbsp;			const user = await User.findById(decoded.id).select("-password");

&nbsp;     			if (!user) {

&nbsp;       			return res.status(401).json({

&nbsp;         			success: false,

&nbsp;         			message: "User no longer exists",

&nbsp;     				  	});

&nbsp;    				 }

&nbsp;     				// 4. Attach user

&nbsp;    			req.user = user;

&nbsp;     			return next();                                                  // next() it like protect is say I am done now I pass to you.

&nbsp;   		} catch (error) {

&nbsp;     			if (error.name === "TokenExpiredError") {

&nbsp;       			return res.status(401).json({

&nbsp; 			        success: false,

&nbsp;    			        message: "Token has expired",

&nbsp;       				});

&nbsp;    		 		}



&nbsp;     		return res.status(401).json({

&nbsp;      		 success: false,

&nbsp;      		 message: "Not authorized, token invalid",

&nbsp;     			});

&nbsp;   			}

&nbsp;		 }



&nbsp; 			// 5. No token provided

&nbsp;		 return res.status(401).json({

&nbsp; 		  success: false,

&nbsp;  		 message: "Not authorized, no token provided",

&nbsp; 		});

};



&nbsp;			

