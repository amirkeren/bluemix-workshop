# Node.js and Cloudant Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application that works with Cloudant NoSQL DB.

# Preparation

1. Install Bluemix CLI using the link [here](http://clis.ng.bluemix.net/ui/home.html)

2. Install the CloudFoundry CLI using the link [here](https://github.com/cloudfoundry/cli/releases)

3. Login to Bluemix with your username and password using the command - `bluemix login -a https://api.ng.bluemix.net`

# Deploy the app on Bluemix

1. Clone this repository or by running `git clone https://github.com/amirkeren/workshop-prep.git` (if you have git installed) or download it as a zip file from [here](https://github.com/amirkeren/workshop-prep/archive/master.zip)
2. Navigate to the cloned project folder (extract the file first if you downloaded the zip file)
3. Edit the manifest.yml file and replace the <APP_NAME> with a *unique* name (it is best to use your fullname-lab1 for example) and then run `cf push`

You can view your deployed application on your [dashboard](https://console.ng.bluemix.net/dashboard/apps)
