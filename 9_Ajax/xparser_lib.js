/***********************************
XParser: An Atom and RSS parser
Version 2.0
by Jeremy McPeak http://www.wdonline.com
Copyright(c) Jeremy McPeak. All Rights Reserved.
Dependencies: zXml Library by Nicholas C. Zakas, http://www.nczonline.net*/
var xparser = {};
xparser.feedType = {
    rss     : 1,
    atom    : 2
};
 
 
xparser.getFeed = function (sUrl, fpCallBack, oCallBackScope) {
    var oReq = zXmlHttp.createRequest();
    oReq.onreadystatechange = function () { //Handle the onreadystatechange event
        if (oReq.readyState == 4) {
            if (oReq.status == 200 || oReq.status == 304) {
                var oFeed = null; //Just a variable to hold the feed object.
                 
                //Create the XML DOM
                var oXmlDom = zXmlDom.createDocument();
                //And load the data.
                oXmlDom.loadXML(oReq.responseText);
                 
                var oRootNode = oXmlDom.documentElement;
 
                //Get the name of the document element.
                var sRootName;
                if (oRootNode.nodeName.indexOf(":") > -1) { //Check to see if the element has a prefix.
                    sRootName = oRootNode.nodeName.split(":")[1]; //Split it and get the actual element name.
                } else {
                    sRootName = oRootNode.nodeName; //Else, just get the element name.
                }
                 
                //Check the element name to decide the feed.
                switch (sRootName.toLowerCase()) {
                    case "feed": //It's Atom. Create the object.
                        oFeed = new xparser.AtomFeed(
                            oRootNode, 
                            fpCallBack, 
                            oCallBackScope
                        );
                        break;
                    case "rss": //It's RSS
                        //Check the version. If it's less than 2, throw an error
                        if (parseInt(oRootNode.getAttribute("version")) < 2) {
                            throw new Error("XParser Error! RSS feed version " +
                                "is not supported"
                            );
                        }
                         
                        //We've made it this far. Create the RssFeed object.
                        oFeed = new xparser.RssFeed(
                            oRootNode, 
                            fpCallBack, 
                            oCallBackScope
                        );
                        break;
                    default: //The feed isn't supported. Throw an error
                        throw new Error("XParser Error: The supplied feed " +
                            "is currently not supported."
                        );
                        break;
                }
            } else { //The HTTP Status code isn't what we wanted; throw an error.
                throw new Error("XParser Error: XMLHttpRequest failed. " +
                    "HTTP Status: " + oReq.status
                );
            }
        }
    };
     
    //Make the request
    oReq.open("GET", sUrl, true);
    oReq.send(null);
};
 
//Each property in the parsed Javascript object is of type "FeedNode".
// This object will have a property called "value" which will hold
// the actual string.

// For instance, if you want to access the "title" property 
// of the third <item> node. after parsing you would use
// obj.items[2].title.value (where obj is the parsed JS object) 
xparser.FeedNode = function (oNode) {
    /**
     * The text contained in the node.
     */ 
    this.value /*:string*/ = (oNode && (oNode.text || oNode.getText())) || null;
};
  
xparser.BaseFeed = function (iFeedType, fpCallBack, oCallBackScope) {
    /**
     * The feed's type.
     * @type Integer
     */
    this.type = iFeedType || null;
     
    /**
     * Represents the <atom:title/> and <rss:title/> element.
     * @type FeedNode
     */
    this.title = null;
     
    
    this.link = null;
     
    /**
     * Represents the <atom:tagline/> and <rss:description/> element.
     * @type FeedNode
     */
    this.description = null;
       this.copyright = null;
     
    
    this.generator = null;
     
        this.modified = null;
     
        this.author = null;
     
    /**
     * Array of <atom:entry/> or <rss:item/> element.
     * @type Array
     */
    this.items = [];
     
    /**
     * The function to call when parsing is complete.
     * @type Function
     */
    this.callBack       = 
        (typeof fpCallBack == "function") ? fpCallBack : function () {};
     
       this.callBackScope  = 
        (typeof oCallBackScope == "object") ? oCallBackScope : this;
};  
 
 
xparser.BaseFeed.prototype = {
     
    parse       : function (oContextNode, oElements, oNamespaces  ) {
        //Loop through the keys
        for (var sProperty in oElements) {
            //Create FeedNode objects with the node
            //returned from the XPath evaluation
            this[sProperty] = new xparser.FeedNode(
                zXPath.selectSingleNode(
                    oContextNode, 
                    oElements[sProperty], 
                    oNamespaces
                )
            );
        }
    }
};
 
 
xparser.BaseItem = function () {
    /**
     * Represents the <atom:title/> and <rss:title/> element.
     * @type FeedNode
     */
    this.title = null;
     
    /**
     * Represents the <atom:author/> and <rss:author/> element.
     * @type FeedNode
     */
    this.author = null;
     
    /**
     * Represents the <atom:link/> and <rss:link/> element.
     * @type FeedNode
     */
    this.link = null;
     
    /**
     * Represents the <atom:content/> and <rss:description/> element.
     * @type FeedNode
     */
    this.description = null;
     
    /**
     * Represents the <atom:issued/> and <rss:pubdate/> element.
     * @type FeedNode
     */
    this.date = null;
};
 
xparser.BaseItem.prototype = {
     
    parse: function (oContextNode, oElements, oNamespaces  ) {
        for (var prop in oElements) { //Create a FeedNode object with the selected node.
            this[prop] = new xparser.FeedNode(zXPath.selectSingleNode(oContextNode, oElements[prop], oNamespaces));
        }
    }
};
 
xparser.RssFeed = function (oRootNode, fpCallBack, oCallBackScope) {
    //Call the parent class.
    xparser.BaseFeed.apply(this, 
        [xparser.feedType.rss, fpCallBack, oCallBackScope]);
       
    var oChannelNode = zXPath.selectSingleNode(oRootNode, "channel");
     
    //Create the hash of property names/element names
    var oElements = {
        title          : "title",
        link           : "link",
        description    : "description",
        copyright      : "copyright",
        generator      : "generator",
        modified       : "lastbuilddate",
        author         : "managingeditor"
    };
     
    //Parse the data
    this.parse(oChannelNode, oElements, []);
     
    var cItems = zXPath.selectNodes(oChannelNode, "item");
     
    //Populate items[]
    for (var i = 0, oItem; oItem = cItems[i]; i++) {
        this.items.push(new xparser.RssItem(oItem));
    }
     
    //Call the callback in the specified scope. Pass this object as a parameter.
    this.callBack.apply(this.callBackScope, [this]);
};
 
//Inheritence setting
xparser.RssFeed.prototype = new xparser.BaseFeed();
 
xparser.RssItem = function (oItemNode) {
    //Call parent class.
    xparser.BaseItem.apply(this, []);
     
    //Create the hash of property names/element names
    var oElements = {
        title       : "title",
        link        : "link",
        description : "description",
        date        : "pubDate",
        author      : "author"
    };
     
    //Parse the data.
    this.parse(oItemNode, oElements, []);
};
 
xparser.RssItem.prototype = new xparser.BaseItem();
 
xparser.AtomFeed = function (oRootNode, fpCallBack, oCallBackScope) {
        //Call the parent class.
 
    xparser.BaseFeed.apply(this, 
        [xparser.feedType.atom, fpCallBack, oCallBackScope]
    );
     
    //Create the oNamespaces hash. We need this for the XPath evaluations.
    var oNamespaces = {
        atom : oRootNode.namespaceURI
    };
     
    //Create the hash of property names/element names
    var oElements = {
        title: "atom:title",
        link: "atom:link/@href",
        description: "atom:tagline",
        copyright: "atom:copyright",
        generator: "atom:generator",
        modified: "atom:modified",
        author: "atom:author"
    };
     
    //Parse it
    this.parse(oRootNode, oElements, oNamespaces);
     
    var cEntries = zXPath.selectNodes(oRootNode, "atom:entry", oNamespaces);
     
    //Populate items[]
    for (var i = 0, oEntry; oEntry = cEntries[i]; i++) {
        this.items.push(new xparser.AtomItem(oEntry, oNamespaces));
    }
     
    //Call the callback in the specified scope. Pass this object as a parameter.
    this.callBack.apply(this.callBackScope, [this]);
};
 
//Inheritence
xparser.AtomFeed.prototype = new xparser.BaseFeed();
 
 
xparser.AtomItem = function (oEntryNode, oNamespaces) {
    //Call the parent class.
    xparser.BaseItem.apply(this, []);
     
    //Create the hash of property names/element names
    var oElements = {
        title       : "atom:title",
        link        : "atom:link/@href",
        description : "atom:content",
        date        : "atom:issued",
        author      : "atom:author"
    };
     
    //Parse the data
    this.parse(oEntryNode, oElements, oNamespaces);
};
 
xparser.AtomItem.prototype = new xparser.BaseItem();