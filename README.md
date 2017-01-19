# OpenWhisk Starter Overview

The OpenWhisk starter overview demonstrates several of OpenWhisks' capabilities

# Preparation

1. [Register](https://console.ng.bluemix.net/registration) for a Bluemix account if you have not done so already

2. Install the Bluemix CLI using the link [here](http://clis.ng.bluemix.net/ui/home.html) - verify that it's working by running `bluemix -v` in the command prompt, this should the diplay the CLI version (if not working, make sure to add the bluemix executable to the PATH, instructions on how to do so can be found here for [windows](http://www.computerhope.com/issues/ch000549.htm), [linux](http://www.troubleshooters.com/linux/prepostpath.htm) or [mac](http://architectryan.com/2012/10/02/add-to-the-path-on-mac-os-x-mountain-lion/#.WH9RLbZ96L8))

3. Install the CloudFoundry CLI using the link [here](https://github.com/cloudfoundry/cli/releases) - verify that it's working by running `cf -v` in the command prompt, this should the diplay the CLI version (if not working, see above for how to add to PATH)

4. Login to Bluemix with your username and password by running `bluemix login -a https://api.ng.bluemix.net` in the command prompt

# Deploying the CloudFoundry application on Bluemix

1. Clone this repository by running `git clone https://github.com/amirkeren/workshop-prep.git` (if you have [git installed](https://git-scm.com/downloads)) or download it as a zip file from [here](https://github.com/amirkeren/workshop-prep/archive/master.zip)

2. Navigate to the cloned project folder (extract the file first if you downloaded the zip file)

3. Edit the manifest.yml file and replace *APP_NAME* with a **unique** name (it is best to use your *fullname-workshop* for example) and then run `cf push`

You can view your deployed application on your [dashboard](https://console.ng.bluemix.net/dashboard/apps). If the application fails to start, try renaming your application and run `cf push` again

# Adding Cloudant NoSQL DB service to the application

1. Go to the creation page of the Cloudant NoSQL DB service using [this](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/) link or search for "cloudant" in the Bluemix catalog

2. Before creating the service make sure it is *bound* to the application you created in the previous step (do this by verifying that the drop-down box on the left under "Connect to:" has your application name selected)

3. Restage the application if prompt to do so

# Adding Watson Language Traslator service

1. Go to the creation page of Watson Language Translator service using [this](https://console.ng.bluemix.net/catalog/services/language-translator) link or search for "translator" in the Bluemix catalog 

2. Click on the "Create" button to add the new service

# Creating the action

1. Go to the [OpenWhisk editor](https://console.ng.bluemix.net/openwhisk/editor) and create a new action (use the default settings) with any name of your choosing

2. Replace the main function with the one below -

```
function main(params) {
	//translateTo values can be any one of the supported 62 languages
	return { payload: params['id'], translateTo: "fr" };
}
```

# Creating the sequence

1. Click on the action you created earlier and then click on "Link into a Sequence"

2. Scroll down and choose "Watson Translator" and then choose "translator" under "Select an Action in this Package"

3. Click on the Green "New Binding" on the bottom left, provide a name for the binding and select the instance of Watson Translator you created earlier

4. Click on "Add to Sequence" and "This Looks Good"

5. Finally click on "Save Action Sequence" (you can change the sequence name if you like) to finish creating the sequence

# Seeing it in action

1. Select the sequence you just created and click on "Run this Sequence"

2. Provide the following JSON input -

```
{
    "id": "Hello"
}
```

3. Finally, click on "Run with this Value" and you should see the translated *Bonjour* response

# Creating the trigger

1. Select the sequence you created in the previous step and then click on "Automate this Action"

2. Choose "Cloudant Changes" and then click on the Green "New Trigger"

3. Provide a name for the trigger and proceed to select the instance of Cloudant you created earlier (note that it selected the "phrases" dbname by default since that is the only one available)

4. Click on "Save Configuration" and "Next"

5. Finally, click on the "This Looks Good" button and "Save Rule" (you can change the rule name if you like)


# Testing the whole flow

1. Go to the [monitor screen](https://console.ng.bluemix.net/openwhisk/dashboard) and note the Activity Log on the right

2. Go to the web applicaton you created in the [previous lab](https://github.com/amirkeren/bluemix-lab1) and proceed to add a new phrase

3. Refresh the Activity Log and you should see the entire sequence was triggered due to the change in the "phrases" DB and the translation of the new phrase you added appears as the output
