# Toe The Line

☞ [toetheline.org.uk](http://toetheline.org.uk)

***Who are the most rebellious MPs across different policy areas?***  
***Who toes the line?***

[![screenshot](https://raw.github.com/dharmafly/toetheline/gh-pages/img/screenshot-1080x640.png)](http://toetheline.org.uk)


## What is it?

This interactive data visualisation is a prototype for showing which MPs have rebelled against their own party line in voting for a particular bill. We've shown the bills categorised as "policies" - e.g. "Terrorism Laws" - and shown which are the top rebels for bills in those categories. The most rebellious MPs are shown above the thick red line, with the least rebellious below the line. The policy being displayed can be changed by clicking the pointing hands.

It is left up to the viewer to decide if these rebels are seen as "free-thinkers" or "trouble-makers".


## Created in 1½ days by

[Premasagar Rose](http://premasagar.com) ([Dharmafly](http://dharmafly.com)), [Peter Cook](http://www.prcweb.co.uk) and [Chris James](http://www.05creative.com).


## "Toe the Line"

In the House of Commons, there is a thick red line on the floor by both the government's and the opposition benches. The lines are supposedly two sword-lengths apart, and all members are expected to keep behind their line, to keep order and prevent physical attacks between opposing members.


## Where next with the app?

Other than generally improving the look and experience of using the tool, we would have loved to include some engagement mechanism where a person could enter, say, a postcode to display his or her own MP and see whether the MP sticks their neck out on certain issues or stays close to the party and, therefore, whether the MP truly represents the views of their constituent. We'd then like to integrate easy ways for the viewer to contact their MP to communicate their views.

Would also like to include:

* Contextual information about each MP, their voting record and their constituency.
* Other indicators of "free-thinking", such as which MPs introduce their own new bills to Parliament.
* Information about which rebellions were made in the face of [three-line whips][whip] or other measures (this particular data is [not made public](http://www.publicwhip.org.uk/faq.php#freevotes) at present).

[whip]: https://en.wikipedia.org/wiki/Whip_(politics)


## The data

We have primarily used voting data made available on [Public Whip](http://publicwhip.org.uk), in addition to some MP data from [They Work For You](http://theyworkforyou.com).


## Technical

While both Public Whip and They Work For You offer data downloads and APIs, the particular groupings of bills and votes that we needed meant that we needed to resort to "[scraping](https://en.wikipedia.org/wiki/Web_scraping)" - i.e. plucking bits of data straight out of the web pages.

We used a homegrown [Node.js](http://nodejs.com) scraper module called [Noodle](http://noodlejs.com) to compile the data set from many hundreds of separate web pages. The compiled data set (collected on 25th November, 2012) [is available in our open source repository](https://raw.github.com/dharmafly/toetheline/gh-pages/js/rebel-data.js). The [repository itself](https://github.com/dharmafly/toetheline) can be copied and improved.

Thank you, Public Whip and They Work For You.