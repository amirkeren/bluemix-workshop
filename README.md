# Apache OpenWhisk Starter Overview

The Apache OpenWhisk starter overview demonstrates several of OpenWhisks' capabilities. The goal is to trigger an ETL operation by the creation of a new document in a Cloudant DB, then reading the document (Extract), translating the content to some target language using Watson Language Translator service (Transform) and then finally saving the result in a designated target DB (Load)

# Table of contents
1. [Preparation](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#preparation)
2. [Deploying the CloudFoundry application on Bluemix](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#deploying-the-cloudfoundry-application-on-bluemix)
3. [Adding Cloudant NoSQL DB service to the application](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#adding-cloudant-nosql-db-service-to-the-application)
4. [Adding Watson Language Traslator service](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#adding-watson-language-traslator-service)
5. [Creating the translation mediator action](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#creating-the-translation-mediator-action)
6. [Creating the sequence](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#creating-the-sequence)
7. [Seeing it in action](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#seeing-it-in-action)
8. [Adding the DB insertion mediator action](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#adding-the-db-insertion-mediator-action)
9. [Extending the sequence](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#extending-the-sequence)
10. [Creating the trigger](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#creating-the-trigger)
11. [Testing the whole flow](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#testing-the-whole-flow)
12. [Bonus](https://github.com/amirkeren/bluemix-workshop/blob/master/README.md#bonus)

# Preparation

1. [Register](https://console.ng.bluemix.net/registration) for a Bluemix account if you have not done so already

2. Login by going to your [dashboard](https://console.ng.bluemix.net/dashboard/apps) and continue to create an organization name and space name

# Deploying the CloudFoundry application on Bluemix

We will now deploy the CloudFoundry Node.js web application so that we will have a UI to work with

1. Deploy the CloudFoundry web application using the "Deploy to Bluemix" button below (you'll need to sign in to Jazz Hub and on the first login you'll be prompted to choose an alias for your account)

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/amirkeren/bluemix-workshop.git)

Once deployment is finished, you can view your deployed application by clicking on "View Your App" or see it on your [dashboard](https://console.ng.bluemix.net/dashboard/apps)

# Adding Cloudant NoSQL DB service to the application

We will now provision a new instance of Cloudant NoSQL DB to be used as the database for our web application

1. Go to the creation page of the Cloudant NoSQL DB service using [this](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/) link or search for "cloudant" in the Bluemix catalog

2. Before creating the service make sure it is *bound* to the application you created in the previous step (do this by verifying that the drop-down box on the left under "Connect to:" has your application name selected)

3. Restage the application if prompt to do so

4. Select the Cloudant NoSQL DB service you just created and click on "Service Credentials" followed by "New Credential" and finally click "Add" (this will later allow OpenWhisk to connect to that DB instance)

5. Once the application finishes restaging, you can go go ahead and play around with the UI by adding new English phrases and saving them in the DB

# Adding Watson Language Traslator service

We will now create the Language translation service that will be used to perform the actual translations

1. Go to the creation page of Watson Language Translator service using [this](https://console.ng.bluemix.net/catalog/services/language-translator) link or search for "translator" in the Bluemix catalog 

2. Click on the "Create" button to add the new service (leave it *unbound*)

# Creating the translation mediator action

We will now create the action that will transform the incoming message so that the output will be formatted to the proper input for the Watson Language Translator API

1. Go to the [OpenWhisk editor](https://console.ng.bluemix.net/openwhisk/editor) and create a new action by clicking "Create an Action" on the top left, enter a name for the action and click "Create an Action"

2. Replace the main function with the one below -

```
function main(params) {
	var phrase = params['id'];
	//in this case we use French ("fr") but you can choose any of the other supported ISO 639-1 codes
	//translateTo values can be any one of the supported 62 languages
	var targetLanguage = "fr";
	console.log("Phrase to translate is - " + phrase);
	return { payload: phrase, translateTo: targetLanguage };
}
```

Note that the changes are auto-saved but not live. In order to publish them you will need to click the "Make It Live" button on the bottom right

# Creating the sequence

We will now create the sequence translator-mediator-action -> watson-translator, meaning we pass the phrase to a translator action

1. Select your newely created action on the left and click on "Link into a Sequence"

2. Scroll down and choose "Watson Translator" and then choose "translator" under "Select an Action in this Package"

3. Select the "Language Translator" binding on the bottom left

4. Click on "Add to Sequence" (note the flow of the sequence) and then click on "This Looks Good" to confirm

5. Finally click on "Save Action Sequence" (you can change the sequence name if you like) and "Done" to finish creating the sequence

# Seeing it in action

We will now test the sequence we created by passing it a phrase test message for translation

1. Select the sequence you just created under "My Sequences" and click on "Run this Sequence"

2. Provide the following JSON input -

```
{
    "id": "Hello"
}
```

Finally, click on "Run with this Value" and you should see the translated *Bonjour* response

# Adding the DB insertion mediator action

We will now add the action that will transform the incoming message so that the output will be formatted as the Cloudant document to be created

1. Click on one of the actions on the left under "My Actions" and create yet another new action, same as before, provide it with a name and replace the main function with the one below - 

```
function main(params) {
	//this will create a new document with an id value of the translated phrase
	var translation = params.payload;
	console.log("Translated phrase is - " + translation);
	return { doc: { _id: translation } };
}
```

Make a note of the name you chose for the action, we will need it in the next step (don't forget to **Make It Live**)

# Extending the sequence

We will now extend the sequence to translator-mediator-action -> watson-translator -> db-mediator-action -> db-insert,
meaning we pass the translated phrase to an action that will reformat it and on to an action that will store the translated phrase in the DB

1. Select the sequence you created in the previous step again and then click on "Extend"

2. Select "My Actions" and choose the name of the action you had just created and click "Add to Sequence" (this will take the translated result and convert it to a document form)

3. Click on "Extend" again, but this time choose "Cloudant"

4. From the many available options, choose "create document" (you can choose to "View Source" if you want to see how the actual document creation works) and proceed to add a new binding by clicking the Green "New Binding" button on the bottom left

5. Provide a name for the binding and proceed to select the instance of Cloudant you created earlier while making sure the dbname selected is the **"translation"** DB (this will take the document created by the db-mediator-action we added and insert it to the "translation" DB)

6. To finish, click on "Save Configuration", followed by "Add to Sequence" and then on "Save Your Changes"

# Creating the trigger

To finish the flow we will create a trigger to run the sequence. The trigger will be a change in the "phrases" DB

1. Select your sequence again and click on "Automate"

2. Choose "Cloudant Changes" and then click on the Green "New Trigger"

3. Provide a name for the trigger and proceed to select the instance of Cloudant you created earlier while making sure the dbname selected is the **"phrases"** DB

4. Click on "Save Configuration" and "Next" (note that the new flow now includes the trigger at the start)

5. Finally, click on the "This Looks Good" button and "Save Rule" (you can change the rule name if you like) and "Done"

# Testing the whole flow

1. Go to the [monitor screen](https://console.ng.bluemix.net/openwhisk/dashboard) and note the Activity Log on the right

2. Go to the web applicaton you deployed earlier and proceed to add a new phrase

3. Refresh the Activity Log and you should see the entire sequence was triggered due to the change in the "phrases" DB and the translation of the new phrase you added appears as the output

4. Go to the Cloudant instance you created (you can find it in your [dashboard](https://console.ng.bluemix.net/dashboard/services)), select it and click "Launch" on the "Manage" tab

5. Select "Databases" on the left and the "translation" database, and you should see the translation of the phrase you entered stored in the database as a new document

# Bonus

Change the target translation language to a different language than French and add a new phrase to see the result
