(function(window)
{   
    var IndexedDB = function()
    {
        var me = {};
    
        me.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        me.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        me.db = ''; 
        me.dbVersion = 1; 
        me.selectedItems = [];
    
        me.init = function()
        {

        };
        
        me.openDataBase = function (dbname, pointCount, readwrite)
        {
            var self = this;
            try {
                    var request = window.indexedDB.open(dbname, self.dbVersion);                    
                    request.onsuccess = function (event) 
                    {
                        self.db = event.target.result; 
                        if(readwrite == 'read')
                        {
                            self.readData(dbname, ['LOG'], pointCount);
                        }
                        if(readwrite == 'write')
                        {
                            self.addData({guid:'2008-05-19T00:03:04.000000', data:1}, pointCount);
                        }
                        
                                          
                    };
                    request.onerror = function (event) 
                    {
                        console.log("indexedDB.open Error: " + event.message);                        
                    };
                    request.onupgradeneeded = function(event) 
                    {
                        var db = event.target.result;
                        if(!db.objectStoreNames.contains('LOG'))
                        {                        
                            var ObjectStore = db.createObjectStore("LOG", { keyPath: "id",autoIncrement:true});                            
                        }
                    };
                }
            catch (e) 
            {
                console.log("Error: " + e.message);                
            }
            
        };
        
        
        me.addData = function (Data, pointCount)
        {            
            var transaction = this.db.transaction("LOG", "readwrite");
            var objectStore = transaction.objectStore("LOG");
            for (i = 0; i < pointCount; i++) 
            {
                Data.data++;
                objectStore.put(Data);                
            }   
            transaction.oncomplete = function()
            {
                console.log('Transaction completed.');
            };
        };
        
        me.readData = function(dbname, objectStoreName, pointCount)
        {
            var transaction = this.db.transaction(objectStoreName, "readwrite");
            var objectStore = transaction.objectStore(objectStoreName);  
//            objectStore.openCursor().onsuccess = function(event) 
//            {  
//                var cursor = event.target.result;  
//		if (cursor) 
//                {  
//                    if(cursor.value.data > 70000)
//                    {
//                        if(cursor.value.data < 72000)
//                        {
//                            me.selectedItems.push(cursor.value);
//                        }
//                    }
//                    cursor.continue();  
//		}  
//            }; 
            
            for (i = 0; i < pointCount; i++) 
            {
                objectStore.get(i+1);                
            }
            transaction.oncomplete = function()
            {
                console.log('Transaction complete.');
            };
            
        };
        
        
        
        
        
        
        me.changeDbVersion = function (version)
        {
            this.dbVersion = version;
        };
        
        me.deleteDataBase = function (dbname)
        {
            var deleteDbRequest = window.indexedDB.deleteDatabase(dbname);
            deleteDbRequest.onsuccess = function (e) 
            {
                console.log("Database deleted successfully.");
            };
            deleteDbRequest.onerror = function (e) 
            {
                console.log("Database error: " + e.target.errorCode);
            };
        };

        return me;
        
    }; 
    
    window.IndexedDB = IndexedDB;
    

})(window);
