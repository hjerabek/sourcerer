// sourcerer configuration
// if not provided, the sourcerer will execute with a default configuration
return {
    // the directories to search through (default=[""])
    directories:["","test"],
    // the names of the functions that reference sources (default=["require","source"])
    names:["require","source"],
    // the target ECMAScript specification, i.e. the option "target" for the typescript compiler (default="ES5")
    tsctarget:"ES5"
}