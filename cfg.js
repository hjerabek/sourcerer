// srcr configuration (if not provided, it will execute with a default configuration)
return {
    // the directories to search through (default=[""])
    directories:[""],
    // the names of the functions that reference sources (default=["require","source"])
    names:["require","source"],
    // the target ECMAScript specification, i.e. the option "target" for the typescript compiler (default="ES5")
    tsctarget:"ES5",
    // a regular expression matching all references that should be kept as they are (default=/^vertx-(web|lang)-js/i)
    rxIgnoredReference:/^vertx-(web|lang)-js/i
}