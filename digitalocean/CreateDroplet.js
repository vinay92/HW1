var needle = require("needle");
var os   = require("os");
var fs = require("fs");

var config = {};
config.token = process.env.DIG_OCEAN_TOKEN

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},


	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":[1298942],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	deleteDroplet: function(dropletID, onResponse) {
		data = null;
		var url = "https://api.digitalocean.com/v2/droplets" + dropletID
		needle.delete(url, data, {headers:headers}, onResponse)
	},

	getDropletInfo: function(dropletID, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletID, {headers:headers}, onResponse)
	}
};


 var name = "vksuryad"+os.hostname();
 var region = "nyc1"; 
 //var image = "centos-5-8-x64"; 
 var image = "ubuntu-14-04-x64";
 client.createDroplet(name, region, image, function(err, resp, body)
 {
 	var dropletID = body.droplet.id;
 	//console.log(dropletID);
 	var ipaddress;

 	if(!err && resp.statusCode == 202)
 	{ 		
 		var interval = setInterval(function() {
 		ipaddress = client.getDropletInfo(dropletID, function(error, response) {		
			var data = response.body;
			if (data.droplet)
			{
				if(data.droplet.networks.v4.length > 0) {					
					clearInterval(interval);
					getIPAddress(data.droplet.networks.v4[0].ip_address);					
				}
			}	
		}); 
	}, 1000);
 		
 	}

 });	

 var getIPAddress = function(ipaddress) {
 	//console.log(ipaddress);
 	fs.appendFile(__dirname + "/../ansible/inventory", "digitalocean ansible_ssh_host=" + ipaddress + " ansible_ssh_user=root ansible_ssh_private_key_file=./keys/dg.key" + "\n")
 	console.log("===================================== Successfully Created a Droplet in DigitalOcean =====================================");
 }

