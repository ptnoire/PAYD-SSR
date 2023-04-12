# it's **PAYD.**

A simple bill tracking app. No non-sense.

The vision for this is an app that is for the people, local storage based so no data transfered meaning no selling of data, ever.

Alternatives to such a thing cost money, aren't easily used or just plain don't work. So I want a super simple user experience to help people manage their bills.

The local storage idea comes from the fact that so many free websites and apps make their money off of selling your data, this app will not link to any personal information but will store what you enter into it on your local machine, meaning I will never have access to your data, therefore no one else will.

I want the user experience to be very satisfying, I've always thought about paying bills as sort of a relief. When I was young and my family was poor, I remember getting to turn the lights back on or heating the house again. Though I would never wish these sort of memories on anyone else, they do inspire me to help others. So when a bill is 'payd' the UI will respond with some good vibes to make it less of a 'I hate paying bills experience' (as if, haha!) to more of a 'Nice!' feeling.

Update 04/07 -- I am returning to finalize a lot of things in this project, mainly import/export and css stylings. I need to finish the date tracker as well, I found a few bugs along the way and then I am going to export this entire app to a react/prisma stack for a more modern feel. This should be incredibly easily given the architecture of this and I will always provide this method for those who do not wish to store or save their data. The larger version of this app with login and database structure is purely for my own projects to see if I can do it, I have no intention to scale it to something larger than a helpful app for users.

## How to Use Payd!

<div align="center"><br>
<b>Step 1:</b> Start by making a new bill, click the button `Submit New Bill` at the top right: <br><img src="https://i.imgur.com/NT9aBPJ.png" />
<br><br>

<b>Step 2:</b> Once the button is clicked, this menu should open up, fill out the form.<br>
<img src="https://i.imgur.com/EZQCgsK.png" /><br>
If the bill is due every month, be sure the check the reoccuring box, (should be on by default)<br>
<br><br></div>

## Viewing Your Bills

Bills have <u>3</u> different states they can be in, let's take a look.<br>

<div align="center">
<br><br>
<img src="https://i.imgur.com/iAoPRhO.png" /><br>
This is a bill <b>that isn't due anytime soon</b>, it will have a light colored border.<br><br>
<img src="https://i.imgur.com/0zH145F.png" /><br>
This is a bill that is <b>PAYD</b> (I know clever.)<br><br>
<img src="https://i.imgur.com/rlYeadw.png" /><br>
This is a bill that is due today!<br><br>
</div>
<b>Notes:</b>
<li>Once a bill is 'PAYD' it will automatically update the next due date, in the case of a reoccuring bill, it will move the date ahead one month. The app will automatically adjust for 'the end of the month' if your bill due date is on the last day, so no worries there.</li><br>
<li>When a bill's due date is within 2 weeks, it will return to the neutral state if it is 'PAYD'.</li><br>
</div>

## Edit Your Bills

If your bill changes, you can easily edit any of the information with just a simple click! (This works for making mistakes with how you input the bills as well.)

<div align="center"><br><br>
<img src="https://i.imgur.com/CIOP48t.png" /><br>
Just click the `Edit Bill` button on your bill.<br><br>
<img src="https://i.imgur.com/M8PZrhh.png" /><br>
And a familiar screen will pop up where you can edit any of the information in the same way that you inputted it.<br>
<li>If you want to get rid of the bill, for any reason, you can click the `Delete` button, a confirmation window will pop to ask you if you're sure and it will remove it from your list.</li><br></div>

## Viewing / Editting Your Bill's History

PAYD will keep track of your bill's history! Each time you hit 'PAYD' a sort of reciept is generated inside the bill's history data. We can view this to see previous amounts paid on which days and also edit or delete them if we need to.<br><br>

<div align="center">
<img src="https://i.imgur.com/byKYYUj.png" /><br>
To view the history, just click the `History` button on your bill.<br><br>
<img src="https://i.imgur.com/SNaudR9.png" /><br>
A modal like this will pop up, showing your bill's history.<br><br>
<img src="https://i.imgur.com/tZDtgKH.png" />
To edit the history, click the `Modify` button inside of the reciept you want to change.<br><br>
<img src="https://i.imgur.com/a0hlTlr.png" /><br>
You will have the option to modify the amount that you paid (perhaps it was an odd amount this month)<br>
Or you can delete the history reciept, let's say you clicked `PAYD` on accident.<br><br>
</div>

## Other Features!

- You can use the sort button at the top to display your bills in a particular fashion, let's say by amounts or by due dates.
- If you accidentally press `Payd` and want to go back, simply click `Edit` and change the date on your bill to whatever it actually is, you can go into your history and delete the receipt as well. (It's like it never happened!)
- Play around: This app will always be free, you can make as many bills and histories as you'd like, if you're curious to see how it all works. You can just simply delete or edit anything as you will. There are no limits!

## Developer Notes

- As of March 3rd, 2023: The style for this app is not set in stone, I wanted to finish a user guide for anyone who happens to check out the app as it is in progress. In it's current state it is ready to go however; I take user experience seriously, even on these seemingly simple applications, I believe it should inspire you to go "I like this", so if the above images are out of date, I will try to come back and update them, however I think the message will remain the same.
- Mobile Responsiveness. I haven't done anything to make this work on mobile yet. I promsie that I will, it makes the most sense that this would be used on your phone, it's just a matter of CSS I promise!
- Known Bugs:
  - Opening Multiple Instances of Modifying a Bill's History will make it so when you click cancel on one of them, it will close them all. Although this is useful, it is not as intended. This is could be a simple fix, just haven't got around to it yet, I'll post it to keep myself accountable.
- Please check the `Features to Implement` section for any future or yet-to-be-implemented updates.
- Thank you for reading this one note. 😎 I coded this entire thing from scratch. It may seem simple but it was a lot of fun, took a lot of work. In the future I plan on porting this to a phone application with OAuth2 login capabilities but I will always use this version for people who care about data privacy or just simply don't want to be bothered with logging into random apps to use them.

## Features to Implement:

- ~~Monthly Date Tracking / Updating : The bill lists should be labeled and organized based on when they are due, a simple 'click' to mark a bill paid should mean that it will set it's next due date to the specified time.~~ (Bi-monthly / Monthly)
- ~~Sorting : Sorting the list by due dates, or whatever the user might want.~~
- ~~View History : Although each object has a history list already, I want the user to be able to explore the history, see when they paid things and the amounts that they were etc.~~
- ~~Edit Bills : This should be fairly easy to do, just on the list, edit amounts, names, dates, delete etc.~~ Note: Lol I said this was going to be easy.
- Import / Export Data : Because the nature of this app will be local storage, I am implementing a way to export the data so that you can upload it to another device, machine etc. It will output the data in a coded string format (I learned something similar when working with World of Warcraft's Addon: weakauras, which I love). -A side note, I do know that this would mean data could leak and be exploited in this way, if someone wanted to figure out my cryptography to uncode the data, luckily this still requires no personal data at all but I will still keep this on the mind to ensure the best privacy for all users.
- Landing Page : I have a thought that the landing page should be a nice marketable page for users to understand the point of a local storage bill tracker and give a nice presentation on why they should use it, and maybe even who I am.
- Finish Styling : ~~This is going to be a work in progress for awhile of course, I bounce back and forth between front end design and back end.~~
- Finish Styling II : Redesign things to look better based on using this app over time, I think it looks good but it still looks primitive. We can do better.
- Mobile CSS: Ok so time to finish the styling so it is responsive, shouldn't be that big of a deal just making sure it all looks nice and tight.
- Get a 'days until x is due' function finished, display it in the list items, update with color schemes based on how close due date is due.
- Gather User Experiences to improve app : You already know what this is, if you've cloned this and tried it out, please let me know. Coding can make one be a hermit and not think outside of the user experience.

## How is the Progress?

March 3rd 2023: Wow. Hard to believe I have nearly finished a side project! Let's gooo! I've updated the readme to give a full explaination of the app, even though it is simple to use, sometimes people don't want to view the whole dang thing and just want to scroll through the images. That's fine by me!

I've listed the things yet to finish, almost there. Ready for users to break apart the app and get that true user feedback. There have been a few mind breaking bugs in this app but conquering them has been an amazing feeling. Heck ya.

Previous Note: Well, there has been far more bugs and weirdness than I expected but I am set out on making this a great app experience. The majority of the work (and you can check the commits) have been fixing bugs that have arisen. Luckily the structure of the code is pretty solid, adding new features and fixing bugs have been pretty easy. The bugs took long because I had to track down what was going on.

We should be seeing a launch of the app soon, I am excited to show it off.
