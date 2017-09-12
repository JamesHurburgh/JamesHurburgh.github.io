define(['sha1.min'],
    function facer(sha1) {

        /*

        Custom sets are made in facer by creating a lis tof 20 parts.  Why twenty?  Becase SHA1 hashes to 20 bytes.
        Each byte then defines it's own part which is resolved seperately.  How is it resolved?  Well that's up to the
        set!
        The basic set structure should be as follows:
        
        { name: "SET_NAME_HERE", parts: [] }
        
        The parts array is the REALLY important bit.  It needs to contain 20 items and they need to look like this:

        { id: 0, output: true, resolve: function(sha1) { return sha1[this.id]; } }

        "id" should be the index in the array and it should go from 0-19 with none missing, otherwise the resolver
        might get confused.
        
        "output" defines if this particular part should be outputted in the generic resolve.  
        This might be false if the value is looked up by another part, but shouldn't be in the final results by itself.
        This lets you set a global value, for example skin colour, whihc is then resolved seperately by each other part 
        that needs it.

        "resolve" is the function that you need to write to resolve each part.  It takes in the full sha1 hash array so
        that if it needs to look up other parts for global values (such as skin colour mentioned above) it can do so easily.
        To find the byte value that should be resolved, just call 'sha1[this.id]'.  What you do with that byte is up to you!
        
        */
        return {
            customSets: {},
            set: {},
            resolvePartById: function(id, sha1) {
                return this.set.parts[id].resolve(sha1);
            },
            resolveInput: function(input, seperator) {
                var hashedInput = sha1.array(input);
                return this.resolveHash(hashedInput, seperator);
            },
            resolveHash: function(hash, seperator) {
                if (!seperator || seperator === undefined) {
                    seperator = "";
                }
                if (!this.set || this.set === undefined) {
                    throw "No set loaded.  Call 'useSet()' before trying to resolve.";
                }
                var output = [];
                this.set.parts.forEach(function(part) {
                    if (part.output) {
                        output.push(part.resolve(hash));
                    }
                });
                return output.join(seperator);
            },
            loadCustomSet: function(customSet) {
                this.customSets[customSet.name] = customSet;
            },
            useSet: function(setName) {
                switch (setName) {
                    case "int":
                        this.set = { name: "int", parts: [] };
                        for (var i = 0; i < 20; i++) {
                            this.set.parts.push({ id: i, output: true, resolve: function(sha1) { return sha1[this.id]; } });
                        }
                        break;
                    case "bin":
                        this.set = { name: "bin", parts: [] };
                        for (var b = 0; b < 20; b++) {
                            this.set.parts.push({
                                id: b,
                                output: true,
                                resolve: function(sha1) {
                                    var value = sha1[this.id].toString(2);
                                    return "00000000".substr(value.length) + value;
                                }
                            });
                        }
                        break;
                    case "hex":
                        this.set = { name: "hex", parts: [] };
                        for (var h = 0; h < 20; h++) {
                            this.set.parts.push({ id: h, output: true, resolve: function(sha1) { return ("0" + (Number(sha1[this.id]).toString(16))).slice(-2).toUpperCase(); } });
                        }
                        break;
                    default:
                        if (!this.customSets[setName] || this.customSets[setName] === undefined) {
                            throw "Set '" + setName + "' not loaded.";
                        }
                        this.set = this.customSets[setName];
                }
            },
        };
    }
);