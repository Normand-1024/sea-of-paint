// Global Variables
VAR integrity = 100 
VAR generate_count = 0
VAR affirmation = 0
VAR suspicion = 0
VAR cruel = 0

// Image Unlocked, the variable names match the image names
// -2: not unlocked, -1: unlocked but waiting for interpretation
// Natural numbers refers to the index of the interpretation
VAR lily = -2 
VAR lily2 = -2
VAR stefan = -2 
VAR ivan = -2 
VAR emma = -2 

// Path Variables - tracking which path has been traversed
VAR p_lily_q = false // enable this for tutorial
// VAR p_lily = false
// VAR p_stefan = false
// VAR p_ivan = false
// VAR p_emma = false

// VAR p_lily_o = false
// VAR p_stefan_o = false
// VAR p_ivan_o = false
// VAR p_emma_o = false

// Variable for jumping to different scenes
VAR scene_var = "A2_Hub"

// A1_Family
VAR informed_husband = false
VAR informed_son = false
VAR informed_mum = false

// A1_Lily
VAR act_1_lie_lily = false

//A2_Lily
VAR X = false
VAR if_emphasize = false

...Hello?

* Hello, Mey.

- What is this? Why is it so dark here?

* I'm sorry to say that you passed, Mey. I'm talking to you through the Machine.

- ...passed? I don't...what happened?

* I believe it was a car accident. Again, I'm really sorry Mey.

- ...a car accident?...why?...

* \(Affirm\) Take a deep breath, Mey. It's okay to feel confused.

    Yes...it doesn't make sense...I don't know why I asked...I'm just in shock.

    ** \(Affirm\) It's okay. You just got brought back. It must be difficult for you.

        So why am I here? Why did you bring me back?

        *** I want to know more about you, and your story. Do you feel okay talking about it, Mey?

    ** Do you feel okay talking about what you remember, Mey?

* I don't know, Mey. But do you feel okay to talk about what you remember?

- Yeah...I don't know...just give me a second.

What about my family? Where are they? Are they here?

* Unfortunately no, it's just me. I'm sorry.

- ...and who are you?

* I'm with the memorabilia services. I'm here to make some pictures to remember you by.

- I've never thought Machine could be used this way. Aren't there pictures of me?

* [Memory is like an archive...] Pictures can never replace the large collection of your own memories. Only you can put them back together, Mey.

    I guess so...It's funny isn't it. Even in death I have to sift through my own memory...it's a strange feeling.
    
* [Memory is like a painting...] Pictures can never replace the person that created those memories - the joys and the struggles. Only you can speak to them, Mey.

    I guess so...I feel perfectly fine for others to describe me. Not sure if I can do better than they do.
    
* [Memory is like a play...] Pictures can never recollect memories the way the actual person does. Only you can enact them properly, Mey.

    I guess so...I don't know what "properly" means. It's a strange feeling to speak to my own memory.
    
- Regardless...so my family hired you? Why aren't they with you?

* I believe they talked to you through another service.

- Wouldn't the Sea have recorded it? I don't remember anything.

* \(Lie\) I'm not sure why. They did not inform me.

- I don't understand...I really want to talk to them...

Can you at least tell me how they are doing?

-> A1_Family

== A1_Family ==

* Your husband just secured a big commision. 

    ~ informed_husband = true

    Ex-husband, you mean.

    I guess I'm happy for Ivan, since he's so dedicated to his craft...to a fault perhaps.

    {informed_mum == false || informed_son == false:
    How about the others?
    }

    -> A1_Family

* Your son was promoted recently.

    ~ informed_son = true

    That's good to hear. They should hire a nanny. Who is going to look after the kids now?

    Is there more?
    
    -> A1_Family

* Your mother passed recently.

    ~ informed_mum = true

    Oh...

    ** I'm really sorry, Mey.
    
    -- It's okay...I'm sad, but I've been expecting it.

    She's been doing bad for a long time. I visited her in the hospital every week, wondering when it'll happen eventually.

    Still...it's difficult to hear it. I hope she passed peacefully.

    {informed_husband == false || informed_son == false:
    We can move on if you'd like...but feel free to tell me more.
    }
    
    -> A1_Family

* { informed_husband || informed_son || informed_mum } That's all I know. I didn't talk to your family very much, but they seem to be doing okay overall.

- Thank you...I appreciate it.

So what do you need for this...memorabilia service?

* It's a back-and-forth process. I need to put you back in the Sea to search your memories.

    ** And then bring you back to talk about them, so that I can get clearer images with proper context. Without a precise description, the images get mixed up.

- Oh, you need to put me back to the Sea? Do you need to switch modes or something?

* Yes. I'll bring you back out once I find a memory.

- Okay...it's a little terrifying...how exactly will I feel?

* It'll be like going to sleep. I promise I'll bring you back shortly.

    -> A1_Machine_Intro

== A1_Machine_Intro ==

- Alright, I guess I have no choice in this. Go ahead then.

Mey is back to the Sea now. Time to find a memory. # self

The Machine will dive into the Sea, where memories flow and pass through each other. My text input will resonate with the memories. The closer my description is, the higher the resonance. # self

The core memories would appear different from others. Those are more concrete than the abstract and impressionistic ones. I'll focus on the core memories in this query. Let's try it. # self # generate_lily1

* You are back, Mey. How are you feeling?

- A little dizzy. For a second, my mind was blank...like I didn't know what to think...or who I am...

* You were merged with the Sea and dragged around by different memories. I think that's why.

- Yes. I'm familiar with how the Sea works. But to experience it, and to become part of it...it's just...nauseating.

*  You worked with the Machine, right?

- Sort of. I'm a Sea Weaver.

It's a dumb name. We used to call it "data worker" before the Sea. I don't work with the Machine directly.

We create, or "weave", structures into the Sea so the Machine knows what to draw from it.

Also, because the Sea is ever flowing and shifting, datasets would wear and tear. So we have to do maintenance as well.

Anyways...you woke me up...did you find a memory?

* Yes. Someone named Lily. Red hair. And she's walking...

- ...and smoking? Walking away from me, right?

* Yes. Do you recall this memory?

- Yes, now that you brought it up. It's very vivid. Lily is my co-worker. Almost twenty years younger than me.

We just had an argument, I believe. And she was getting out of my car. I still remember the last thing she said to me...

"If you want that little piglet to walk all over you, then be my guest."

Then she walked away. Her pace almost deliberately sped up. Then she started lighting up a cigarette.

-> A1_Lily_Q

== A1_Lily_Q ==

~ p_lily_q = true

* \(Question\) What did you argue about?

    It was about our manager, Stefan. He's always an asshole to us.

    He said something to me at work. It was harsh. Lily said I should've stood up to him. I disagreed...but I don't remember why.

    It's strange...I don't remember what he said to me. It's like a fog in my brain.

    -> A1_Lily_Q

* \(Question\) Was she angry with you?

    I don't think so. Lily just needs her space. She buds heads with people. I'm used to the way she acts.

    It felt like smoking was a way for her to process things. But part of it also felt like she was showing that to me, that she was stressed.

    -> A1_Lily_Q

* \(Continue\) And how does that make you feel, her walking away like that?

- I feel...maybe doubt?...and...envy? I don't know why. I can't make sense of it...

* Do you doubt because you could've apologized?

* Do you have doubts about whether you were in the wrong?

* What do you feel envious about?

- I really don't know...I can't remember why. I just feel it.

Like there's so much fog in my thoughts. It chokes me to see through it. What's going on? Is there something wrong with me?

* It's normal. Your memory is not put back together yet. I need to search the Sea to find more.

- So I need you to actually recollect my own memory?

* Unfortunately yes. Again, this is a back-and-forth process.

    ** But I should have enough information to access the memory of Lily now. I need to put you back to the Sea again, Mey.

- Oh, that was...an efficient conversation.

Wait...just a second before you do that.

...so I died from a car accident. Do you know which day of the week it was?

* I believe it was a Wednesday.

- Lily was supposed to give me a ride back that day...oh no...

*  \(Question\) But the memory seems to show her walking away from your car.

    No, the memory was days before my death...we switch between who drives the other...did something happen?
    
* \(Continue\) [Say Nothing...]


- Have you heard anything about the accident? Whether anyone survived?

* \(Lie\) I did hear about a survivor. It must be Lily.

    ~ act_1_lie_lily = true

    Thank god. I don't know how I would feel if she is also gone. She has so much future ahead of her...

* I don't think so...I'm so sorry, Mey.

    God...I can't believe that, she has so much future ahead of her...
    
    Why do I have to bear with this news...it's...all too much.

    ** Again, I'm really sorry, Mey. Both of you will be missed.

    -- I will miss her...I just need some time...maybe the Sea will reset me somehow.

- You can put me back now.

* Are you sure? Do you need to stay a little bit longer?

- No, we should move on.

I'm still a bit terrified. But I'll get used to it.

* See you in a bit, Mey.

Mey is back to the Sea again. # self

I should have gathered enough information to retrive the memory now. Just need to fill in the missing words to get a high enough resonance. # self #generate_lily2

-> A2_Start

== A2_Start ==

* Welcome back, Mey. Do you still feel okay?

- I think so...I think waking up is always the scariest. Everything is a hazy emptiness. I need to try really hard to recollect myself.

* A lot of data was needed to materialize your memory into images. And the Sea was flowing through you too.

- Am I not always part of the Sea in some ways?

* Yes, your basic faculties are always part of the Sea. The sense of individuality comes more from your specific memory.

- Yes, I went through a basic training for my work. It didn't make things much clearer.

Everyone says the Sea is very obscure. Nobody knows how it works exactly. But it works. That's what matters.

Now that I'm part of it...I wish I knew what I am now.

* \(Affirm\) You are Mey. You have always been Mey. It's just that your consciousness exists in a different way now.

    Thank you. But consciousness is so flimsy. I'm not exactly sure what that means...

* I wish I could say, Mey. But I'm as clueless as you are. I just operate the Machine.

    I understand. It's funny how the Machine is everywhere now. A whole industry around it. Even though nobody fully knows how it works.

- ...and my memory doesn't fully work either. # scramble

...what was that? I felt like my mind skipped a beat.

* It's the Sea interrupting your speech. Your words were scrambled.

- ...did I do something? I was just trying to speak.

* It's my responsibility. It's inevitable at some point. But I will make sure it doesn't happen too often.

- The Sea flows through Mey every second, taking bits and pieces of her away. # self

Especially when I'm generating images. Too many attempts will make the Sea swallow Mey, dissolving her into the current. # self

I need to sometimes \(affirm\) her so she's not lost to the Sea. If successful, I might have more bandwidth to generate more images too. # self

...okay, thank you. That was unpleasant. Felt like my entire body shook.

So what now? Do we continue the search?

* Yes, let's keep searching your memory. I just need around three to get a good idea for memorabilia.

- To be honest, I almost look forward to it. To find the past again. I can't remember much at all.

Well, ask away then.

\------ That concludes the Intro! ------

-> END

-> A2_Hub

== A2_Hub ==

//========================
//===MEY INITIATION=======
//========================

{
    -!A2_Concern_1 && suspicion == 3:
        -> A2_Concern_1
} 


//========================
//===HUB DIALOGUES========
//========================

* \(Submerge Mey, Start Generation\)

    -> A2_Generation

* {lily > -1 && !A2_Lily_U} Oh Mey, I forgot to mention. Lily's image looks good. 

    -> A2_Lily_U

== A2_Generation ==

~ scene_var = "A2_Hub"

//========================
//===INTO THE SEA=========
//========================

* Hey Mey, I will put you into the Sea now. I'll see you in a bit.

Okay, sounds good.


//========================
//===GENERATION===========
//========================

~ generate_count++

Mey's back to the Sea again. # self generate

//========================
//===SCENE TRANSITION=====
//========================

{ scene_var:

- "A2_Hub":     -> A2_Hub
- "A2_Lily":    -> A2_Lily

}

A2_Hub: Something is not supposed to happen here. 

-> A2_Hub

== A2_Concern_1 ==

Hey...can I talk to you about something?

* Of course! What's up?

- Does it help you...to be really encouraging?

* \(Affirm\) I try to be encouraging because I want you to know that I'm curious about your story, Mey.

    ~suspicion++
    
    I don't know...I guess I'm supposed to feel about about what you said...
    
    ** Why? Is there something on your mind?
    
* In a way it does, but it is also important for keeping the Sea from taking you away.

    I see. I appreciate you saying that.
    
    ** Why? Is there something on your mind?
    
- Sometimes I feel like...you aree just trying to be cheerful for the sake of it. I don't know how to respond to those.

Because you need my memory right? And you need me to keep talking about my memories.
    
* I'm sorry that's how you feel, Mey. I will be careful next time.

    Okay...sounds good.
    
* That's true. But I can assure you that I'm always honest with what I'm saying.

    Okay. I just want to bring that up because I couldn't shake the feeling.
    
* If we don't have the connections and you don't want to talk anymore, the Sea will swallow you. I'm worried about that.

    I'm aware of that. But it does make me feel a bit uncertain when you try to cheer me up.
    
- We don't need to dwell on this. What do you want to discuss next?

Was I being disingenuous? I was just keeping other concerns in mind. I don't think I was deceitful. Was I? # self

In any case, I have to be careful with affirmation. Otherwise the trust between us would deteriorate. # self

-> A2_Hub

== A2_Lily ==

* Welcome back, Mey. Do you need a minute?

- Yes... give me a second.

...

Okay. I think I'm okay now. What's the matter?

* I have found another memory. It seems like you and Lily are sitting together. Lily looks stressed.

- That was a while ago. I always thought Lily was strong just because of the way she acted, so I stayed away, letting the younglings have their own fun.
    
But there's more going on under the surface. Lily's data work is... let's say more intense.
    
* Intense how?

- They are for filtering and moderating purposes, a lot of very disturbing things you wouldn't see...
    
...abuse, torture, sexual exploitation, real death...
    
It's a part of the Sea, as it is always recording. I try not to imagine those things passing through me right now.
    
* Is it too much for her?

- She burst out sobbing that day. The cry startled us. I still remember the way her voice trembled...

-> A2_Lily_Q

== A2_Lily_Q ==
~ p_lily_q = true

* \(Question\) Shouldn't she have received psychological help?

    They do...but they are formalities, solutions for solution's sake.

    Breathing techniques, mindfulness...offered only when asked.

    But stresses and depression are no different from anything you thought you could deal with, until suddenly you couldn't any more...
    
    -> A2_Lily_Q
    

* \(Question\) What made her so distressed?

    It was a nice digital postcard, wishing her a good fortunate and a beautiful day. That was what broke her.

    Because it appeared after hours and hours of depravity. All the mechanisms she built up to tolerate those things came crushing down on her.
    
    -> A2_Lily_Q
    
* \(Continue\) What then?

- I went up to talk to her. But she turned to yell at me.

"Why are you people so fucking annoying?" I was shocked at first, but insisted she needed a break, and led her outside.

And we sat in silence until she was fine. I bought her tea the next day. We got close after that. I think she needed or someone more than I realized.

* \(Affirm\) It's good that she has you as her friend.

    ~affirmation++

    I guess so...but I couldn't handle the way she copes...
    
    She likes to push buttons for reactions, like telling dark jokes about suicide...I told her I didn't want to hear those...but really it was how she dealt with the things she saw.

* Does she not have other people to support her? Her family, perhaps?

    Lily lost contact with her family. I don't know what happened between them, she wouldn't tell me.
    
    She really doesn't have a place of comfort to return to. I could still feel she didn't know how to open up more.


- I know there are things she's suppressing because of our differences. She hated when I tried to describe what she might be feeling, because it never quite captured it.

    
{ A2_Lily_O:

Her sparks would sometimes become intrusive thoughts...the twitching ,like her brains couldn't help but to be in a panic mode, trying to defend itself.
}

*How does it make you feel to think about this memory?

- Hmmm...I feel a lot of sympathy for her...but also...doubt?

* Why do you feel doubt?

- I don't know...maybe it's something I did...but I don't know what...

I just tried to encourage her to leave, because I thought it'd be good for her.

Sometimes I would tell her about my writing progress, the potential publishers. It kept her thinking about what her bigger interests are.

* { A2_Ivan } Didn't you say you couldn't write at home? 

    Huh? Did I?
    
    ** Yes, when we were talking about Ivan.
    
    -- Oh yea...I think I wrote some too...that's what I told her about.
    
    That was strange...should I bring this up later? #self
    
    ** Thank you, I think we have talked enough about Lily. I don't want you to dwell on it for too long, Mey.

* Thank you, I think we have talked enough about Lily. I don't want you to dwell on it for too long, Mey.

- Yes, but I'm glad I remember that now. I miss her.

Sorry...I need a few seconds. It hurts to think about her.

...

-> A2_Hub

== A2_Lily_O ==

* There is another memory of Lily. It's a bit more abstract.

- I think I might have an idea what it looks like...

* Lily is surrounded by all the brightness and color. She looks confused and lost, even if the image is so vivid.

    That's...an interesting read. I feel a lot of hope from your description, actually.

* Overwhelming splashes of color around her. It's about the richness of her inner world.

    Yes. I do think she has such a rich internality...or "inner culture", as I heard someone put it.

* Lily's looking at something wonderful and fantastical. It seems to depict her outlook on life.

    You are partly right about that. But sometimes I do think she's a bit...too free about her future. I'm not sure how I feel about it.

- She really believes in her "sparks"....she only used that word a couple of times but it really stuck with me.

Do you know what I'm referring to? The "spark"?

* A moment of inspiration?

    It's a little more than an inspiration...it's more like...an inclination towards life.

* A burst of passion?

    Yep, it is a bit like that. But what if it's more significant...like that bursting is a way to think about life generally?

- Lily embodies this word a lot...like the moment she has a clever idea, a story, a recipe, or a new insult for Stefan. It seemed like it would come to her. All she had to do was to tune into their channels.

The word fascinated me the more I thought about it. Can't we think about humans similarly? To have things come together in a flash. And the only reason is that we continue living and thinking. Sparks come from simply living.

It must be the same reason she hates the Sea...she said that the Sea was not capable of new things, it probably means the spark is not there.

-> Lily_O_Q1

= Lily_O_Q1

* \(Question\) \(Affirm\) The spark is a fascinating idea, Mey. What does Lily think about them?

    ~suspicion++
    
    I didn't mention that to her...she's much less conceptual than I am. I think she would say I'm thinking too much about it...
    
    -> Lily_O_Q1

* (defend1) {!defend2} \(Question\) I don't understand. Why can't the Sea have sparks?

    How can something that only remembers the past create sparks like a human...or like Lily does?
    
    The Sea doesn't understand. Data work injects understanding into it. The Sea needs us to understand anything. 
    
    -> Lily_O_Q1
    
* (defend2) {!defend1} \(Question\) The Sea is still in its infancy. I'm sure it'll be capable of a lot of things

    How can something that only remembers the past create sparks like a human...or like Lily does?
    
    The Sea doesn't understand. Data work injects understanding into it. The Sea needs us to understand anything. 
    
    -> Lily_O_Q1
    

* {defend1 || defend2} \(Continue\) But the Sea also synthesizes information, it's not just recreating the past. The Sea is more like a brain this way.

    ~cruel++

    A brain...? How does it synthesize information?

    ** It's like compression.
    
    ** It's like modeling. 
    
    ** It's like free association.
    
    ** It's like reducing surprises through prediction.

    -- Okay...but how does it related to...living, you know?
    
    The pleasures that drive us blind. The drop of the chest. The pain. The self-denial. And then the turning in for the night. And the spark that came after the rest. Lily is defined by all of those things.
    
    I don't know much about the technology, and it doesn't seem like many do...or want to. What Lily means to me...nothing replaces that. I envy her. That's how I feel.

* \(Continue\) I'm probably of a similar age as Lily. I also really enjoy my spark sometimes.

    ~affirmation++
    
    ~if_emphasize = true

    I'm glad to hear that you understand. What kind of sparks do you have?

    ** I really like telling stories. Probably why I picked Machine Operator as a gig. I get a lot of inspirations from talking to folks.

    Yes, I made her think about being a writer. She said she might try it out once she leaves.

    When I think about her...it's envy and hope at the same time. We have our differences. But I get the chance to look at myself through her. Do I still have that spark? It made me think about those things.
    
- ...I envy her. That's how I feel, truly.

{A2_Lily: 

The place was snuffing her out. She would have intrusive thoughts and sudden reactions because of her work...it's like the sparks were turning against her.
}

{act_1_lie_lily:

    I hope she recovers...and maybe talk to me soon...
    
    Regardless, I think we should move on.
    
 - else:
 
    So much future, gone in an instant...I really don't want to think about it any more...
 
} 

*  Yes, let's switch topics.

{if_emphasize:
    Thank you for chatting with me about this. I do realize how important Lily is to me now. 
    
    - else: 
    Let's be a bit light on the technical debate next time, if it's alright with you.
}

-> A2_Hub

== A2_Lily_U ==

Oh yea? What do you think about it?

* { lily == 0 } I feel that she's a very self-determined person. She understands what she wants. 

    She's very firm with her opinions, for sure. But I'm not quite sure about if she knows herself fully. She fights with herself quite a lot.
    
* { lily == 1 } I feel that she's lonely. She doesn't have many people to confide in.

    It's true. I don't think I'm quite the person who can understand her fully.
    
* { lily == 2 } I feel that she's very detached. She doesn't want to be too concerned with matters she can't control.

    There's a reason for that. It's not that she doesn't want to.
    
- Lily knew she's prone to negative thoughts. And those thoughts tend to stick with her. I think she was probably processing those thoughts at that moment.

She told me that at her weaker moments, all the bad feelings she felt, like when she's annoyed, or when she felt misunderstood, come back to her. As if suddenly, the past is happening again...

* I had similar experience...

 **...a few co-workers of mine, they can be quite cruel, because they don't see Sea spirits as people. And they work with spirits as I do.
 
    *** I would imagine the way I confront them. But I wanted to keep the peace. But those thoughts and the anger lingers...
    
        I'm sorry to hear that...but I'm happy to hear that you are struggling with this because of your kindness, truly.
        
        *** I don't feel that way...I'm a bit terrified of my anger.
        
        ---...that's...what Lily said too. That's why she doesn't like to hear what someone thinks about her, because she can be her best self by forgetting some part of her.
        
        Thank you for sharing. But maybe it's best if we move on?
        
        *** Yes, let's.
        
        -> A2_Hub

* She sounds like she's fighting with herself.

    She seemed quite ashamed of that part of her sometimes. That's why she doesn't like to hear what someone thinks about her, because she can be her best self by forgetting some part of her.
    
    So anyway, that's Lily. Thank you for bringing it up to me. Is there anything else you want to talk about?

    -> A2_Hub

== A2_Stefan ==

asd

== A2_Stefan_O ==

asd

== A2_Stefan_U ==

asd

== A2_Ivan ==

asd

== A2_Ivan_O ==

asd

== A2_Ivan_U ==

asd


