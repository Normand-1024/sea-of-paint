// Global Variables
VAR current_stage = 0 // 0: talking, 1: find core memory, 2: unlock lily, 3: unlock 3 core, 4: get interpretations
VAR core_unlocked = 0
VAR integrity = 100 
VAR generate_count = 0
VAR affirmation = 0
VAR total_affirmation = 0
VAR suspicion = 0
VAR cruel = 0
VAR memorabilia = 0

// Image Unlocked, the variable names match the image names
// -2: not unlocked, -1: unlocked but waiting for interpretation
// Natural numbers refers to the index of the interpretation
VAR lily = -2 
VAR lily2 = -2
VAR stefan = -2 
VAR ivan = -2 
VAR emma = -2 

VAR lily_spark = -2 
VAR stefan2 = -2 
VAR ivan2 = -2 
VAR emma2 = -2 

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

// Variable for bringing up optional content
VAR d_lily_o = false
VAR d_stefan_o = false
VAR d_ivan_o = false
VAR d_emma_o = false

// Variable for jumping to different scenes
VAR scene_var = "A2_Hub"

// A1_Family
VAR informed_husband = false
VAR informed_son = false
VAR informed_mum = false

// A1_Lily
VAR act_1_lie_lily = false

...Hello?

* Hello, Mey.

// ~ lily = 0
// ~ current_stage = 3
// ~ core_unlocked = 1
// -> A2_Hub

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

* I'm with the memorabilia services. I'm bringing you back for a scheduled maintenance.

    ** "You are a spirit of the Sea now, along with many others. You are a part of them as much as they are part of you." 
    
        *** "We need to bring you back occasionally to make sure that you still remain as yourself in the Sea. We are making sure you are not eroding and dissolving into the Sea."
        
                **** \(Lie\) It's a simple procedure. We'll talk over some of your memories to re-affirm your identity. And I'll return you to the Sea.
        
- That's it? You bring me out for the first time just to talk, and then you're going to put me back?

Where's my family? Why am I talking to a stranger?

* I believe they talked to you through another service.

- Wouldn't the Sea have recorded it? I don't remember anything.

* \(Lie\) I'm not sure why. They did not inform me.

- I don't understand...I really want to talk to them...

Can you call them? Put them on the phone, maybe? I don't want to talk to you right now.

* I'm sorry but that's not possible, Mey. But I can tell you how they are doing.

    ** This is necessary to keep you intact, Mey. The quicker we do this the quicker I can end the session.
    
    ** \(Lie\) This is necessary to keep you intact, Mey. The quicker we do this the quicker I can end the session. Maybe you'll see your family in the next one.

- ...

I guess...I have no choice then.

...

I'm sorry if I was a bit aggressive. It's just...a lot to think about. I know this must be hard for you too.

Please tell me how they are doing, if that's okay.

* I understand, Mey. And I'm happy to tell you about them.

-> A1_Family

== A1_Family ==

* Your son was promoted recently.

    ~ informed_son = true

    That's good to hear. Fay should hire a nanny. Who is going to look after the kids now?

    Is there more?
    
    -> A1_Family
    
    
* Your husband just secured a big commision. 

    ~ informed_husband = true

    Ex-husband, you mean.

    I guess I'm happy for Ivan, since he's so dedicated to his craft...to a fault perhaps.

    {informed_mum == false || informed_son == false:
    How about the others?
    }

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

~current_stage = 1

The core memories would appear different from others. Those are more concrete than the abstract and impressionistic ones. I'll focus on the core memories in this query. I have no ways to know what the Sea will return. Maybe we can try some names first. # self # generate_lily1

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

Now I need to inquire about the memories. Don't forget to ask how she feels about the memory too - that's part of the input needed as well. # self

-> A1_Lily_Q

== A1_Lily_Q ==

* \(Question\) What did you argue about?

    It was about our manager, Stefan. He's always an asshole to us.

    He said something to me at work. It was harsh. Lily said I should've stood up to him. I disagreed...but I don't remember why.

    It's strange...I don't remember what he said to me. It's like a fog in my brain.

    -> A1_Lily_Q

* \(Question\) Was she angry with you?

    I don't think so. Lily just needs her space. She butt heads with people. I'm used to the way she acts.

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

- We switch between who drives each other home. Lily was supposed to give me a ride back that day...oh no...

Have you heard anything about the accident? Whether anyone survived?

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

~ p_lily_q = true
~current_stage = 2

Mey is back to the Sea again. I should have gathered enough information to retrive the memory now. Just need to fill in the missing words to get a high enough resonance. # self #generate_lily2

-> A2_Start

== A2_Start ==

* Welcome back, Mey. Do you still feel okay?

- I think so...Waking up is quite scary, to be honest. Everything is a hazy emptiness. I need to try really hard to recollect myself.

* A lot of data was needed to materialize your memory into images. And the Sea was flowing through you too.

- Am I not always part of the Sea in some ways?

* Yes, your basic faculties are always part of the Sea. The sense of individuality comes more from your specific memory.

- Yes, I went through a basic training for my work. It didn't make things much clearer.

Everyone says the Sea is very obscure. Nobody knows how it works exactly. "But it works. That's what matters."

Now that I'm part of it...I wish I knew what I am now.

* \(Affirm\) You are Mey. You have always been Mey. It's just that your consciousness exists in a different way now.

    Thank you. But consciousness is so flimsy. I'm not exactly sure what that means...

* I wish I could say, Mey. But I'm as clueless as you are. I just operate the Machine.

    I understand. It's funny how the Machine is everywhere now. A whole industry around it. Even though nobody fully knows how it works.

- ...and my memory doesn't fully work either. # scramble

...what was that? It felt like my mind skipped a beat.

* It's the Sea interrupting your speech. Your words were scrambled.

- ...did I do something? I was just trying to speak.

* It's my responsibility. It's inevitable at some point. But I will make sure it doesn't happen too often.

- The Sea flows through Mey every second, taking bits and pieces of her away. # self

Especially when I'm generating images. Too many attempts will make the Sea swallow Mey, dissolving her into the current. # self

I need to sometimes \(affirm\) her so she's not lost to the Sea. If successful, I might have more bandwidth to generate more images too. # self

...okay, thank you. That was unpleasant. Felt like my entire body shook.

So what now? Do we continue the search?

* Yes, let's keep searching your memory. I just need around three to get a good idea for memorabilia.

~current_stage = 3

- To be honest, I almost look forward to it. To find the past again. I can't remember much at all.

Well, ask away then.

// \=== That was the end of the Intro! Thank you for Playing! \===

// -> END

-> A2_Hub

== A2_Hub ==

//========================
//===MEY INITIATION=======
//========================

{
    -!A2_Concern_1 && suspicion == 3:
        -> A2_Concern_1
        
    -!A2_Concern_2 && suspicion == 5:
        -> A2_Concern_2
        
    -!A2_Affirm_Push && affirmation < total_affirmation / 2:
        -> A2_Affirm_Push
} 


{ core_unlocked == 3 && not A2_Next_Step:

    I unlocked something

}

//========================
//===HUB DIALOGUES========
//========================

{ 
- core_unlocked == 3 && not A2_Next_Step:

    * [\(Move to the Next Step\)] -> A2_Next_Step

- else:

    + [\(Submerge Mey, Start Generation\)] -> A2_Generation
}
    
    
* {d_lily_o} There is another memory of Lily. It's a bit more abstract and striking.

    -> A2_Lily_O
    
* {d_stefan_o} There is a memory of...I think Stefan. A very messy image. It looks... 

    -> A2_Stefan_O
    
* {d_ivan_o} I found a memory of Ivan. Ivan seems to be painting. There's flowers everywhere. It looks...

    -> A2_Ivan_O
    
* {generate_count >= 3 && informed_mum} Do you want to talk about your mother, Mey?

    -> A2_Emma
    
* {lily > -1} Oh Mey, I forgot to mention. Lily's image looks good.

    -> A2_Lily_U
    
* {lily2 > -1} I managed to access the memory where you and Lily sat together, Mey.

    -> A2_Lily_U2
    
* {ivan > -1} I got access to the memory of you with Ivan during dinner, before the moment you proposed the divorce.

    -> A2_Ivan_U
    
* {A2_Lily && A2_Ivan} I want to double check with you about your writing, Mey...

    -> A2_Lie
    
* {A2_Lie && not A2_Lie_2} \(Dissolve\) I don't know, Mey. I don't think you were honest about your writing progress with me.

    -> A2_Lie_2
    
+ {memorabilia > 0} [\(Conclude Contract\)] 

    Am I ready to conclude the contract? Can't say I look forward to what's coming next... # self
    
    ++ I have gotten the memorabilia I need, Mey. -> A3_Ending
    
    ++ [\(Go Back\)] -> A2_Hub

== A2_Generation ==

~ scene_var = "A2_Hub"

//========================
//===INTO THE SEA=========
//========================

+ Hey Mey, I will put you into the Sea now. I'll see you in a bit.

{
    -generate_count == 0:
        
        ->going_in_0
        
    -generate_count == 1:
    
        ->going_in_1
    
    -generate_count == 2:
    
        ->going_in_2
        
    -generate_count >= 3:
    
        Okay, sounds good. I'm ready.
} 

->diving

=going_in_0

To be honest...I'm still a little bit scared. Can you give me a moment?

* Of course, take your time.

- ...

Okay, I think I'm ready. Whatever happens happens I guess.

* You can do it, Mey. I'm putting you back now.

->diving

=going_in_1

* Do you still feel scared?

- Yes...what if I won't be able to recover who I am? I can't really get over that.

* You always will. The Machine makes sure that you will recover.

    ** The Machine has some level of control over the kind of spirits emerge from the Sea. Those without them would only respond according to the input without thinking, like the reflection of waves from the drop of a pebble.
    
- Yes, I worked on datasets for those..."things" - machine assistants, bots. I can't believe I exist in the same machinery as those things now.

Anyways, thank you for reassuring me. You can put me down now.

->diving

=going_in_2

I think I have a better idea what'll happen this time...

* I'm glad to hear that. See you soon, Mey.

->diving

//========================
//===GENERATION===========
//========================

=diving

~ generate_count++

Mey's back to the Sea again. # self # generate

{
    -generate_count <= 1:
        
        ->come_back_1
        
    -generate_count == 2:
    
        ->come_back_2
    
    -generate_count == 3:
    
       ->come_back_3
       
    -generate_count >= 4:
    
       ->come_back_4
} 

=come_back_1

* Welcome back, Mey. How do you feel?

...

I still felt...lost for a second. Like I should be thinking about something, but I don't remember what that thing is.

You calling my name helped. Everything came back gradually.

Anyway, how is it going?

->scene_transition

=come_back_2

* Welcome back, Mey. Do you need a minute?
    
- Yes... give me a second.

...

Okay. I think I'm okay now. What's the matter?

->scene_transition

=come_back_3

* Do you feel okay, Mey?

- I think I'm getting the hang of it now...I feel fine.

{informed_mum: 

    Thank you for telling me about my mother, by the way. Thinking about her made me feel more reassured somehow. Made it easier to recover who I am.
    
    Maybe I could talk to her about her mother as well? # self
}

What should we discuss now?

->scene_transition

=come_back_4

+ How are you, Mey?

- I'm feeling okay. What should we talk about now?

->scene_transition

//========================
//===SCENE TRANSITION=====
//========================

=scene_transition

{ scene_var:

- "A2_Hub":     -> A2_Hub
- "A2_Lily":    -> A2_Lily
- "A2_Stefan":    -> A2_Stefan
- "A2_Ivan":    -> A2_Ivan


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

== A2_Concern_2 ==

-> A2_Hub

== A2_Affirm_Push ==

Actually, before we switch topics. Can I bring up something?

* Of course, what's on your mind, Mey?

I just want you to know that...I can feel the Sea. The current flowing through me, pushing me around. And I have to find my balance again and again...

It's just that...I feel like it's getting stronger...

You said you would make sure it doesn't happen too often. # scramble

...

No...that was...awful.

You said you would make sure it doesn't happen too often.

So I just want to bring that up with you.

I may have been to lax with (affirming) her. I might have to do it more now. # self

* I apologize, Mey. I promise I will take care of it.

- That's good to hear. Just want to let you know.

Let's move on.

-> A2_Hub

== A2_Lie ==

Yes? What's the matter?

* You mentioned not making any progress at home when we talked about Ivan.

- Yes. The data worker job, raising a family, dealing with Ivan's things - I just couldn't focus. 

And I never felt confident in my own ideas, either. The passion for them just faded after a while.

...I wish I had Lily's energy.

* But you also said you mentioned your writing progress to Lily.

- ...I don't know. Maybe I did, maybe I didn't...

I don't remember very clearly, obviously. Perhaps the Sea is messing with my memories.

* \(Dissolve\) Come on, Mey. If that's the case, I would be able to tell. You're lying.

    -> A2_Lie_2

* Perhaps. I guess it's not important to talk about this now.

    Yes, I don't see how that's important, to be honest. It's not like I have some groundbreaking manuscripts stored somewhere.
    
    This is going to bother me, isn't it. # self
    
    Let's talk about something else.
    
    -> A2_Hub

== A2_Lie_2 ==

~cruel++

* It is important for me to get an accurate account of your story, Mey. Please let me do my job.

- Okay, okay. I don't understand why you're so bothered by this.

I lied to Lily. I already talked about this. I wanted her to think about her bigger dreams.

I didn't want to see her wasted there. It's not a good place for her. You know this.

{act_1_lie_lily: It's not like it even matters now that she's gone.}

* But why do you feel the need to deny it?

- I just feel...guilty, I guess. I don't think my lying did what I had hoped.

She started getting anxious talking about work, more so when I sometimes probed about what she wanted to do after this job...

It's like she blamed herself for staying? It just became a bit worrying...like she started twitching and shaking involuntarily, like she's having a mini-attack...

...can we not talk about this? I don't want to think about it...

* So you think Lily started twitching because you pushed her to quit?

    ~cruel++

    ...maybe...I don't know...I don't...
    
    I thought Lily was a strong person.  # scramble
    
    I really really did think that. I thought she could take it. # scramble
    
    I didn't mean it. I didn't want her to {act_1_lie_lily:die|suffer}. # scramble
    
    I made it happen, didn't I. It was me. I did it. # scramble
    
    This is bad. The current is getting stronger. She is going to be washed away. # self
    
    I need to do something, now. # self
    
    ** \(Affirm\) It's okay, Mey. We all have done something we regret.
    
    *** \(Affirm\) I don't blame you. You shouldn't blame yourself either.
    
    **** \(Affirm\) Trust me, I have done worse things. But I know I'm a good person, you know you are too.
    
    ***** \(Affirm\) You have to believe that, Mey. If you don't believe me, please believe in yourself.
    
    -- ...
    
    I think...I'm back now...
    
    Fuck you for letting that happen. # scramble
    
    ...
    
    Please promise me you won't do that again.
    
    ** I promise, Mey. I won't pressure you again.
    
        *** I'm sorry for pushing, Mey. I just wanted to do my job right.
        
        *** It is just important for me to get the story right, Mey.
    
* Of course, we'll stop.

    ** I'm sorry for pushing, Mey. I just wanted to do my job right.
    
    ** It is just important for me to get the story right, Mey.
    
- You are quite the pusher, aren't you. Now you have your satisfaction, I guess.
    
I don't think I ever lied the way I did to Lily, however. I guess that's also the reason it was very difficult for me to be content with what I did.

And good news for you, there's probably no other lie for you catch, detective.

Can we move on? I want to remember more things. That's why we're here, right? Not...whatever this is.

* Of course, Mey. We'll move on.

-> A2_Hub

== A2_Emma ==

Not very much, I don't think. I'm still processing her passing.

* We don't have to talk about it if you don't want to.

- No, I do. Briefly perhaps. It's part of my story. It's important to me.



The humanity of Emma is one of staying-with, she is Mey's comfort place (connect with Ivan, and Lily maybe?

I could see the turmoil in her stillness. Her searching inside for something that could even remotely feel like a fact about him, while shame would overcome her of her own deteriorating mind.

* Did you ever consider putting her into the Sea?

    What? Absolutely not.
    
    I feel like that's a ridiculous question. What does that even mean?
    
    ** You are right. I apologize for asking.
    
All she needs is me staying with her, you know. And slowly, as she started losing the wit that gives her voice, I was one of the few people who could interpret her now. 

Anyway, that's all I want to say about that. I can feel that she passed in peace. That's all I care about.

~total_affirmation++

* \(Affirm\) Thank you, Mey.

~affirmation++

- Sure

-> A2_Hub

== A2_Lily ==

* I have found another memory. It seems like you and Lily are sitting together. Lily looks stressed.

- Yes, I remember now. That was a while ago. I always thought Lily was strong just because of the way she acted, so I stayed away, letting the younglings have their own fun.
    
But there's more going on under the surface. Lily's data work is...let's say more intense.
    
* Intense how?

- They are for filtering and moderating purposes, a lot of very disturbing things you wouldn't see...
    
...abuse, torture, sexual exploitation, real death...
    
It's a part of the Sea, as it is always recording. I try not to imagine those things passing through me right now.

-> A2_Lily_Q1

= A2_Lily_Q1

* \(Affirm\) This is why we need Sea Weavers. Your job is very necessary indeed.

    ~suspicion++
    
    ...I guess so? I don't feel a particular way about it. It's just a part of the job.
    
    -> A2_Lily_Q1
    
* \(Question\) How do the Sea Weavers filter those things out? 

    Same with any other jobs dealing with the Sea, including yours.
    
    They just mark those content as something undesirable. Perhaps giving the Sea a stronger signal for those more egregious ones. It's like the Sea is adopting through our inputs.
    
    But all we can do is still mere suggesting. The flows are never predictable. Voices can only shape the waves so much. There's no guarantee that the Sea won't give back similar things.
    
    ** Yes, sometimes you need to suggest many times to the Sea, so it knows which part to connect and which part to sever.
    
        *** There's also filters in the Machines to catch them when the Sea returns something undesirable. It's never perfect, of course.
    
            Yes, you know how the gig works.
            
            But that's enough technical jargons. Do you want to ask more questions?
            
            -> A2_Lily_Q1
    
    -> A2_Lily_Q1
    
* \(Continue\) So what happened that day?

- She burst out sobbing that day. The cry startled us. I still remember the way her voice trembled...

-> A2_Lily_Q2

= A2_Lily_Q2

~ temp A2_Lily_Q2_ask = false

* \(Question\) What made her so distressed?

    ~A2_Lily_Q2_ask = true

    It was a nice digital postcard, wishing her a good fortunate and a beautiful day. That was what broke her.

    Because it appeared after hours and hours of depravity. All the mechanisms she built up to tolerate those things came crushing down on her.
    
    -> A2_Lily_Q2

* \(Question\) Does she receive psychological help?

    They do...but they are formalities, solutions for solution's sake.

    Breathing techniques, mindfulness...offered only when asked.

    But stresses and depression are no different from anything you thought you could deal with, until suddenly you couldn't any more...
    
    -> A2_Lily_Q2
    
* \(Continue\) What then?

- I went up to talk to her. But she turned to yell at me. {A2_Lily_Q2_ask: There's a wholesome digital postcard on her screen.}

"Why are you people so fucking annoying?" I was shocked at first, but insisted she needed a break, and led her outside.

And we sat in silence until she was fine. I bought her tea the next day. We got close after that. I think she needed someone more than I realized.

~total_affirmation++

* \(Affirm\) It's good that she has you as her friend.

    ~affirmation++

    I guess so...but I couldn't handle the way she copes...
    
    She likes to push buttons for reactions, like telling dark jokes about suicide...I told her I didn't want to hear those...but really it was how she dealt with the things she saw.

* Does she not have other people to support her? Her family, perhaps?

    Lily lost contact with her family. I don't know what happened between them, she wouldn't tell me.
    
    She really doesn't have a place of comfort to return to. I could still feel she didn't know how to open up more.


- I know there are things she's suppressing because of our differences. She hated when I tried to describe what she might be feeling, because it never quite captured it.
    
{ A2_Lily_O:

Her sparks would sometimes become intrusive thoughts. There would be twitching, like her brains couldn't help but to be in a panic mode, trying to defend itself.
}

* How does it make you feel to think about this memory?

- Hmmm...I feel a lot of sympathy for her...but also...doubt?

* Why do you feel doubt?

- I don't know...maybe it's something I did...but I don't know what...

I just tried to encourage her to leave, because I thought it'd be good for her.

Sometimes I would tell her about my writing progress, the potential publishers. It kept her thinking about what her bigger interests are.

* { A2_Ivan } Didn't you say you couldn't write at home when we talked about Ivan? 

    Huh? Did I?
    
    ** Yes, when we were talking about Ivan. You said you made no progress in your writing.
    
    -- Oh yea...I think I wrote some too...that's what I told her about.
    
    That was strange...should I bring this up later? #self
    
    ** Thank you, I think we have talked enough about Lily. I don't want you to dwell on it for too long, Mey.

* Thank you, I think we have talked enough about Lily. I don't want you to dwell on it for too long, Mey.

- Yes, but I'm glad I remember that now. I miss her.

Sorry...I need a few seconds. It hurts to think about her.

...

Okay, what now?

-> A2_Hub

== A2_Lily_O ==

VAR if_emphasize = false

I think I might have an idea what it looks like...

* Lily is surrounded by all the brightness and color. She looks confused and lost, even if the image is so vivid.

    That's...an interesting read. I feel a lot of hope from your description, actually.

* Overwhelming splashes of color around her. It's about the richness of her inner world.

    Yes. I do think she has such a rich internality...or "inner culture", as I heard someone put it.

* Lily's looking at something wonderful and fantastical. It seems to depict her outlook on life.

    I don't know...perhaps that's true. But it feels more...impulsive, perhaps.

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

* \(Affirm\) The spark is a fascinating idea, Mey. What does Lily think about them?

    ~suspicion++
    
    I didn't mention that to her...she's much less conceptual than I am. I think she would say I'm thinking too much about it...
    
    -> Lily_O_Q1

* (defend) \(Question\) I don't understand. Why can't the Sea have sparks?

    How can something that only remembers the past create sparks like a human does?
    
    The Sea doesn't understand. Data work injects understanding into it. The Sea needs us to understand anything. 
    
    -> Lily_O_Q1

* \(Continue\) I also really enjoy my spark sometimes.
    
    ~if_emphasize = true

    Oh? What kind of sparks do you have?

    ** I really like telling stories. Probably why I picked Machine Operator as a gig. I get a lot of inspirations from talking to folks. I think I can be more creative because of it.

    -- Yes, I made her think about being a writer. She said she might try it out once she leaves.
    
    
* {defend} \(Continue\) The Sea is more capable than you think.

    ~cruel++

    ** There's more logic and structure to the flows than we could ever understand. The scientists can only map the Sea, but never fully account for its eccentricity. They have shown that the Sea can do reasoning. That's why you're here.
    
        *** The Sea synthesizes information, it's not just recreating the past, but coming up with something entirely new that only the dancing of the waves knows how. 
        
            **** The Sea is more like a brain this way. The waves are like signals traveling through the neurons.

    -- A brain...? How does it synthesize information?

    ** It's like compression.
    
    ** It's like modeling. 
    
    ** It's like free association.
    
    ** It's like reducing surprises through prediction.
    
    ** I don't know how. The Sea just does it.

    -- Okay...but how does it related to...living, you know?
    
    The pleasures that drive us blind. The drop of the chest. The pain. The self-denial. And then the turning in for the night. And the spark that came after the rest. Lily is defined by all of those things.
    
    I don't know much about the Sea, and it doesn't seem like many do...or want to. What Lily means to me...nothing replaces that...

- When I think about her...it's envy and hope at the same time. We have our differences. But I get the chance to look at myself through her. Do I still have that spark? It made me think about those things.
    
...I envy her. That's how I feel, truly.

{A2_Lily: 

The place was snuffing her out. She would have intrusive thoughts and sudden reactions because of her work...it's like the sparks were turning against her.
}

{act_1_lie_lily:

    I hope she recovers...and maybe talk to me soon...
    
    Regardless, I think we should move on.
    
 - else:
 
    So much future, gone in an instant...I really don't want to think about it any more...
    
    I think we should move on.
 
} 

* Are you sure? Should we talk about Lily more?

- There's no use thinking too much about it. The pain moves only when you decide to move. That's how I think about it.

*  Yes, let's switch topics then.

{if_emphasize != true:
    Let's be a bit light on the technical debate next time, if it's alright with you.
}

-> A2_Hub

== A2_Lily_U ==

Oh yea? What do you think about it?

* { lily == 0 } I feel that she's a very self-determined person. She understands what she wants. 

    Not quite. She's very firm with her opinions, for sure. But I don't think she knows herself fully.
    
* { lily == 1 } I feel that she's lonely. She doesn't have many people to confide in.

    It's true. I don't think I'm quite the person who can understand her fully.
    
* { lily == 2 } I feel that she's very detached. She doesn't want to be too concerned with matters she can't control.

    It's...close. But not quite true. It's not that she doesn't want to. Lily would never want to self-isolate. She's just protecting herself.
    
- Lily knew she's prone to negative thoughts. And those thoughts tend to stick with her.

She told me that at her weaker moments, all the bad feelings she felt, like when she's annoyed, or when she felt misunderstood, come back to her. As if suddenly, the past is happening again...

She talked about how she's terrified of her own impulsiveness. She's worried that she couldn't contain the struggles with herself within herself. Something will leak out, turning her into a hurtful person.

* \(Affirm\) You are a really observant person, Mey.

    ~suspicion++
    
    ...Am I? I think she just felt comfortable talking about those things with me. She knows herself but isn't quite comfortable with it all the time.
    
* Sounds like Lily couldn't really accept herself.

- That's why she doesn't like to hear what someone thinks about her, because she can be her best self by forgetting some part of her.
    
I've learnt to not comment on my observations about her, partly being scared that she might take it the wrong way.

Anyway...I don't want to go too deep into her psychology. Only she knows who she really is.{not act_1_lie_lily:<>..not that it matters now.}
        
What do you want to talk about next?
        
-> A2_Hub

== A2_Lily_U2 ==

Great! Tell me about it.

* {lily2 == 0} It's really moving. Both of you sit among the trees in silence together. You seem really patient with her.

    Huh...we were sitting near the sidewalk. There are only so many trees on the street. Maybe the Sea is making things up again.
    
    It was peaceful, sure. But to be honest, I was quite distracted. I couldn't help but started wondering...
    
* {lily2 == 1} You both sit among the trees in silence. But it seems like you are distracted. Was something bothering you?

    Huh...we were sitting near the sidewalk. There are only so many trees on the street. Maybe the Sea is making things up again.
    
    But you are right. There were moments in between the words of comfort. I started wondering if this job is healthy for Lily...
    
- I could do my data work job fine, and I'm happy with it. But imagine for Lily to be in such stress for weeks, months and years. She was also making disturbing jokes to cope. Will she lose her own humanity in the process?

* You are worried too much, Mey. The human mind is more resilient than that. Lily's work is important for the Sea.

    ~cruel++
    
    How can you say that? Have you sat down and scrolled through hours of inhumanity? I don't think you can just shake that off like nothing.

* I don't know, Mey. Maybe it will impact her long-term, maybe not.

- I'm curious. What is it like for you to be in this job? Does talking to the spirits make you more emphathetic, maybe?

* Not necessary. There's always a balance that each Operator has to reach. This is a job, afterall.
        
    ** I am grateful getting to know you, Mey. But this has to end at some point. Some operators are more efficiency-driven that way. They simply ask the questions and get it over with.
        
- Really? They could do their maintenance work for the spirit just through procedural questions? And the spirits would just spit it out? What kind of questions are those?

* The questions are not important. The spirits are typically happy to share, because they need the Machine Operators to evoke those memories for them.

    ** {act_1_lie_lily} The point is that I sympathize with you, Mey. Let's hope that Lily will recover and quit the job soon.
    
    ** {!act_1_lie_lily} The point is that I sympathize with you, Mey. It must not be easy seeing Lily suffering like that, and imagining the kind of person she might turn into.
    
- Yes. That was my worry...it almost felt like...I needed to do something about it...

In any case, thanks for sharing. Maybe we should move on?

* Yes, let's talk about something else.

-> A2_Hub

== A2_Stefan ==

* I see a memory with you and Stefan. He's wearing a suit, and you seem distressed at your work station.

- Yes, everything is coming back to me. It was the reason Lily and I argued. He said something to me.

"You can go upstairs to make textiles. Maybe you'll be more comfortable making clothes."

It was cruel. Lily heard it, and started yelling at him.

-> A2_Stefan_Q1

= A2_Stefan_Q1

* (asked_why) \(Question\) Why did he say that to you?

    He has been wanting to push middle-aged folks like us out for a while. But I'm a good worker, so it shut him up for a while. But I would give him leverage to pressure me...
    
    I would say no to certain contracts. Like camera footage where I have to label whether someone broke work rules.
    
    That day, I got a contract to identify Centuria accent from taped voices, because I'm Centurian.
    
    It was creepy. I refused the contract again and again. Eventually Stefan got angry.
    
    ~total_affirmation++
    
    ** \(Affirm\) You absolutely don't have to do work you consider immoral.
    
        ~affirmation++
    
       Thank you for saying that. It was a really hard situation to uphold my principles. I almost gave in as he vomited abuse at me.
       
       -> A2_Stefan_Q1
    
    ** Wouldn't there be people who will do the work anyways?
    
       Theoretically yes.
    
       But guess what, I was the only Centursian there. So I got to decide. Too bad for the little piglet.
       
       -> A2_Stefan_Q1
    
    ** Sea Weaver work is really competitive. Stefan probably needs to deal with higher management too.
    
        ~cruel++
        
        That's what he said to pressure me...
    
        You are not wrong. But am I really supposed to accept everything? I can't imagine being so submissive like that.
        
       -> A2_Stefan_Q1
        
* {asked_why} \(Question\) You could have accepted the work but intentionally mess it up.

    Haha. It would've been fun, but I don't think it would work.
    
    They have hidden test data to see if we did it correctly. They wouldn't pay if I try to get things wrong.
    
   -> A2_Stefan_Q1
    
* \(Question\) Did you work in a factory?

    Well, it's certainly set up like a factory.

    Let me guess, most Sea Weavers you know are remote, correct?

    ** Yes, I know my friends would be Sea Weavers mostly as transitions. Intentionally unstable, in a way.

    -- They also have places where people can go for work. It's more stable that way. We can get regular salaries as long as the company gets contracts.

    And the managers would have more control that way...
    
   -> A2_Stefan_Q1

*\(Continue\) Why did you and Lily got into a disagreement afterwards?

    I'm fortunate to have Lily to stand up for me, saying I had the right to refuse, and Stefan was being an assohole. But some of the words she used...

- "Bootlicker", "brownnose", "rim gobbler"...I don't know, they are supposed to be funny I guess.

* To be honest, I like "rim gobbler".

    Well yes, You're right, but...
    
    Hahaha, sorry, it is pretty funny. Strange that I was uncomfortable with those words at that moment.

* Why did you feel uncomfortable?

- I don't know...I feel the same fog in my brain as before...I guess I feel some kind of sympathy for him?

He was one of us back then. Really nice to me and everyone. Everything changed after he got promoted to manager.

He understood a lot of the harshness of the job, so he promised to change the place for the better as a manager.

He really believed it. A new generation and all.

* It sounds like he was corrupted by power.

    Maybe, some would say power reveals rather than corrupts. Not sure which one is truer for Stefan.

* It sounds like power revealed his true nature.

    Maybe, or maybe power corrupted him by roping him into a different place. Not sure which one is truer for Stefan.

- We could tell he didn't know how to be in power. It was like he was trying to discover himself through it, and he knew he wasn't as sophisticated. He hated to look uncertain and struggling in front of others, especially Lily.

And under pressure from the upper division, he found his manager persona. But he would still consider himself to be one of us, especially the young ones...but when we started openly criticizing him, he really didn't take that well. Lily's turning on him definitely made him a more cynical person.

* Was he...fond of Lily?

    Haha, I think so. Lily has a confidence in her that men were drawn to.
    
    Especially for a guy like Stefan, approval from Lily would probably mean a lot.

* He sounds like someone who craves other's approval.

- The more I think about him...all the things he did reek of his pathetic insecurity.

It's spite...a lot of spite for me. To think about him now. I could go on.

* This is a healthy point to stop, Mey. Thank you for sharing these with me. I should have enough to access the memory now.

- Makes sense. I'll just get angrier and angrier. Let's move on.

So what do you want to talk about next?

->A2_Hub

== A2_Stefan_O ==

* ...obscured. His face is all messed up, because he doesn't have any clear identity of himself left.

    I'm not sure what you mean. His imagery is quite clear in my mind. Maybe you are seeing something different than what I'm seeing.
    
    Perhaps it's accurate metaphorically. He is someone who is lost to me. His present is incompatible with his past.

* ...lost. He is left alone with himself in never-ending doubt. 

    That's how I imagine him...I can't imagine Stefan any other way than someone struggling with himself.

- Let me ask you this: do you have expectations for the future? Like being married, owning a house?

* I plan my future around having a comfortable life. Marriage and financial security are important for that.

    That sounds exactly like Stefan. It sounds all decent and nice. But it can be

* I just want to do the things I like doing, and be with people I enjoy being with. I want to tell stories, maybe make movies. Nothing else matters.

    You would enjoy talking to Lily, I'm sure. Stefan is not quite like that.

* I want to do the things I love. But I might not be so lucky. The future is uncertain, but I look forward to finding my balance.

    Of course. Be sure to take risks if you can. Anything worth doing is scary at the beginning. Maybe Stefan tried to find his balance too early...
    
* I don't know how that's relevant, Mey.

    ~cruel++

    I guess not...I'm just curious how many people are just like him.

- I worked with Stefan in a different company then. We were both data workers.

When my son Fay found a more serious tech work, Stefan pulled some strings to find similar jobs. Stefan and I moved into the same city where Fay is.

I really appreciated him. I was able to be there for Fay's child. They didn't need to hire a nanny when I wasn't working.

* Stefan sounded like a really good friend back then.

- Yes. But I sometimes I wanted to leave my job early to take care of the kid. Stefan didn't like that. It hurts productivity. Young people don't have obligations like that.

Stefan also has ambitions, just like Fay.

He was following the excitement around the Sea. You might be too young back then. Things like "A New Data Revolution".

* Yes, it made an impression on me even as a child, especially how the Sea blurred the boundary between private and public storage.

- He was following something more esoteric: how true general intelligence can only be achieved through a global, ever-recording memory.

I still remember something he said, something about how much investment is in this new industry.

He wants to retire early. And he wanted to have enough savings, so his kid wouldn't be in debt the way he was...it felt like he was blaming us for failing him.

* Are we still talking about Stefan?

- Huh? No, I thought I was talking about Fay.

* Do you not want to talk about Stefan anymore?

- I don't know...Fay's memory just came to me...I forgot what I had to say about Stefan...Can we just continue with Fay?

* Sure, Fay sounds like he plans really far ahead.

- Yes, he expects a lot for his future. But the comment just made me feel a little hurt...

Maybe Fay felt the pressure when we had to take out loans, because Ivan and I didn't earn enough to pay for his college.

I was good at my job as a data worker. It earned decent money to weather the storm when Ivan couldn't find work. Could I have done more to make it better for him?

~total_affirmation++

* \(Affirm\) Don't put so much on yourself, Mey. You did the best you could.

    ~affirmation++

    Thank you. Maybe I have failed him somehow. My work is not flashy. But I raised a family. And I loved them to the best of my ability.

* He probably didn't mean it that way. I'm sure he was just simply venting.

    I'm not sure if you could say that. What if he is saying that to make me feel lesser?

- But how can the Machine achieve understanding without us? Is that not worthy of dignity?

I wish the person I knew and worked with is still in there somewhere. And the cruelty he put me and others through still haunts a part of him...

That's the only way I can hold onto a sense of pity for him...and perhaps I would even have sympathy for him sometimes.

Anyway, let's move on. I don't have much to say about him anymore.

I don't know who we are talking about anymore...but asking more question might make her more confused. Perhaps it's best to let it go. # self

* Yes, let's.

-> A2_Hub


== A2_Stefan_U ==

asd

-> A2_Hub


== A2_Ivan ==

* I see you sitting next to a kitchen table, deep in thought. Perhaps you drifted off at dinner?

- Oh...is there someone next to me?

* Yes, someone is sharing the meal with you. I believe it's Ivan.

- I remember now...and all the time after that moment, when I continuously revisited it. I proposed to divorce at that dinner.

The thought had been in my mind for months. Even so, it felt impulsive. And I don't know if I will be able to do it again.

I was simply being idle after dinner, with many thoughts going in and out of my mind. Then, Ivan said, "remember to finish the statement for me tomorrow". It was for one of his paintings.

And then that was it. Something came to me. And I said we should get a divorce.

-> Ivan_Q1

= Ivan_Q1

* \(Question\) What then?

    He couldn't believe it at first. And then he threw the usuals at me: I was making a big deal out of nothing. We should talk about it tomorrow. He would change, and he would prove it to me once he finished this commission.
    
    It's too late for me, of course, even if it took strength to finally say it's over.
    
    -> Ivan_Q1

* \(Question\) Why did you need to write statements for him?

    Ivan is an abstract painter. I'm a better writer than him. So I took on the responsibilities: applications for exhibitions, public-facing statements, chores like that. I just picked up some little tasks for him here and there.
    
    -> Ivan_Q1
    
* \(Continue\) What he said was such a small thing, but it was clearly something more than that.

 - Do you ever get a sense about the different ways people see you? Like you could tell how they look at you differently?
    
I still remember the college years, when Ivan and I initially fell for each other. We would talk about so many different ideas, big and small.

He said he really appreciated me then, everything about me, the little "signatures" behind my ideas and my words. It was like he wanted to see through my skins, tracing the flows and the faults. I came to know myself through him.

* And it's different now?

- Now, it's a "seeing as". He wrapped me up with something that's more...knowable or known.

I wanted to be an artist too...to write. But I gave it up for our relationship. We couldn't build a family if neither of us is financially stable...

-> Ivan_Q2

= Ivan_Q2

* \(Question\) Did Ivan not support you to write in your spare time?

    I don't think I'm naturally a good writer, even though I love it, think about it so much. That's why Ivan was drawn to me at first.
    
    But that's so many decades ago. I still have ideas, but they mean something very different now...
    
    I need time and practice, you see, just like every other skill. But I couldn't write with so much on my plate. Ivan said he was busy too. So nothing came out of it.

    -> Ivan_Q2

* \(Question\) Did you pursue writing seriously?

    I was a literature major, mind you. That's why we got together…two young people with dreams to create...

    I worked with a news outlet after graduation, working on both journalistic and entertainment articles..the short version is that I left and found the data worker job.

    -> Ivan_Q2

* {A2_Lily} \(Question\) But you still made progress with your writing, correct? You said it when we were talking about Lily.

  Did I? I don't remember...

  ** Yes, you said you made progress on your writing. You said you told Lily that.

  -- Perhaps...but I don't think I made any progress worthy of note. It's a lot of scattered ideas. Nothing concrete came of them...

  ** I see.

  -- It's quite different from how she described it before...should I bring this up later? # self
  
  ->Ivan_Q2
          
* \(Continue\) Do you still feel that you made the right decision?

- I think so. Although I still found myself wondering how he was feeling quite intensely afterwards...

I still saw him when Fay invited us to dinner. He's cordial with me...but only cordial. It seemed he shut away how he actually felt.

Regardless, I feel a bit detached. Even if I still wonder whether he misses me at times, I have accepted that the answer will never come.

We just became too different. I did so much for him, just to go through such estrangement...perhaps because of it. I can't help myself from going to that place of spite.

* Thank you, Mey. That much be quite an intense memory.

    ** But maybe we can move on to something else.

    ** It's hard to say goodbye to the ones you love. But maybe we can move on to something else.

- Okay, let's move on then. What do you want to discuss next?

-> A2_Hub

== A2_Ivan_O ==

* ...inspired. Plants and flowers are blooming out of Ivan's work. There's a certain joyful energy to the picture.

    ...I can see why you see it that way. There's a certain allure to Ivan's lifestyle. But to me, the allure is disturbed. It is more about isolation than anything else.

* ...isolating. Ivan seems overly submerged in his paintings. It becomes something all-consuming for him.

    Yes, that's how I see him. Perhaps I still hold onto a past version of him...that's what the plants symbolize for me.

- Ivan used to paint plants, almost in a hyperrealist fashion, with exquisite attention to how the lights and colors interact. Despite that, it really isn't about the realism that draws him...

It is about the drawing the "vitality" in the plants, the desire for life even in stillness, that's what he wanted to draw. He doesn't want to describe his painting as realistic.

His ideas evolved because people only saw his paintings as illustrations. But that's not how he wants to be remembered as an artist. The framing is a little different now.

-> Ivan_O_Q1

=Ivan_O_Q1

* \(Question\) Did the Sea also become popular with the Machine then?

  The Sea was not a thing back then, the Machine worked on locally stored data. But its capabilities were still impressive.

  It was significant but also controversial. The Machine would be trained on our articles, repeating our work back to the users...sometimes even distorting it.
  
  ->Ivan_O_Q1

* \(Question\) Did you appreciated his paintings?

  I would lose myself staring at those paintings. It's part of the reason I fell for him. Even if he became more of an abstract painter, it is still beautiful...still him, in a way.
  
  ->Ivan_O_Q1

* \(Continue\) What is Ivan's new framing now?

- Here's a piece of his new framing: it's all about the paint. Paint itself has a force, a vitality. It's a language on its own, capable of its own beauty and ugliness...

But what Ivan meant by "forces" really changed a lot...and it became more and more elusive to me. He experimented with black paint for a year, trying exhaust its possibilities.

I also quit my writing job then to find more stable ones, so he could feel freer to understand his own creativity.

->Ivan_O_Q2

=Ivan_O_Q2

* (idea_opinion1) {idea_opinion2}  \(Question\) I think I understand it. It is somewhat similar to his old idea, correct?

   I believe so too. To see past the "thingness" in order to reach some forces beyond. But that's the extent to which I got out of it.
   
   ->Ivan_O_Q2

* (idea_opinion2) {idea_opinion1} \(Question\) It's a bit too abstract for me..

    I don't blame you. I don't entirely follow either. I simply just interpret the "forces" as feelings, the vibration behind the "things".
    
   ->Ivan_O_Q2

* (job) \(Question\) Why did you quit the the writing job?

   I didn't enjoy writing articles, to be honest. And perhaps the Machine also pushed me to quit.

   It was taking profits away from us, draining an industry that's already underfunded. Our folks wanted to fight it. At least they could share part of the profit.

   It was a long legal battle, but the end result was insulting: a backroom deal to give us a lump sum...

   The catch is that we have to find ways to integrate the Machine on our writing floor...like an accelerator program. That's when I decided to leave.
   
   ->Ivan_O_Q2


* {job} \(Continue\) What happened to you after you quit your job?

    I became a data worker. We had Fay. I had to take care of a kid...It's nothing notable. Ivan's change is perhaps more interesting.
    
    ~total_affirmation++
    
    ** \(Affirm\) It's not about Ivan, Mey. I want to know more about your story.
    
        ~affirmation++
        
        Thank you...at least someone cares. But it really wasn't anything notable. I couldn't do creative writing because all of the chores. Ivan's creativity went through a transformation.
    
    ** Okay, so what happened to Ivan afterwards?

* \(Continue\)  What happened to Ivan after you quit your job?

- He became a part of a circle that could afford big commissions. But the circle doesn't just collect things, they also collect people.

They were fascinated by deep thinkers like Ivan. And deep thinkers stuck with them to become social...worldly even.

The "vitality" and the "force" shifted meaning too...it meant the willpower to make things, to build things, to take risks in changing the world for the better.

->Ivan_O_Q3

= Ivan_O_Q3

* \(Question\) Are they rich people?

    Some of them are. But there are just too many words to describe them...those who want to do everything, those who have visions, those who are lifetime learners...

    They celebrated the Sea: finally we can be connected together and become *truly* worldly. Knowledge and creativity can finally become accessible to all. Their desires to create can finally be unleashed.
    
    ->Ivan_O_Q3

* \(Question\) What did you think about his painting after his ideas changed?

   The paintings still look fascinating. But the feelings just became...feelings. I didn't have much to say about them anymore...the paint became untranslatable to me.

   "What Bill said just stuck in my mind, I don't know how to explain it", I didn't know who Bill was...still don't. But it didn't feel like my place to ask.
   
   ->Ivan_O_Q3

* \(Continue\) I can sense that you feel alienated by it.

- Yes. Alienation and detachment, perhaps.

Why should I care about a world vision if I have a kid to take care of, bills to pay, and stresses to be waited out? This might be selfish, but who is there to optimize these things for me?

* It's not selfish to ask for those things, Mey. But we should move on.

- Of course. We've been talking about this long enough...doesn't matter now.

What should we talk about next?

->A2_Hub

== A2_Ivan_U ==

* {ivan == 0} It looked like you were thinking about something, trying to process something. Did you feel sad?

    Not necessarily sad. It's just a lot of thinking as I have accepted my decision to leave.

* {ivan == 1} It looked like you were zoning out, not really thinking about anything concrete.

    That's not quite right. There was a lot going on in my mind then.

* {ivan == 2}It looked like you were tuning out of Ivan, trying to find your own inner peace.

    I don't think so...? Maybe there's some unconscious posture thing going on there. Maybe it's just how I sit sometimes.
  
- I did remember thinking about where my life had been to that point and would be after the divorce. I'd been thinking about disvorce for a long time. Keeping that decision without taking the action felt safe...but also disquieting. I knew what I had to do, but I just couldn't do it...until Ivan pushed me.

Come to think of it. Perhaps he felt that I was very cruel, because I was so certain about the divorce. He didn't know that I'd struggled with the thoughts for a long time...

* \(Affirm\) It was a stressful situation. You must be really confused too. Maybe it's good to forgive yourself for that.

    ~suspicion++

    But maybe I could've been more attentive to his feelings? It felt...impulsive. Perhaps there would be less hurt if I planned it out.
  
* Maybe it wasn't perfect, sure. But it's in the past now.

    You are right. Maybe I could apologize to Ivan when I see him again...I'll hold onto that thought.

- But I'm curious. Would you have quit your job like me for a family, or a special someone?

->Ivan_U_Q1

=Ivan_U_Q1

* Perhaps, if you really felt like family was more important than a career.

    I didn't ask you to emphasize with me. I asked whether *you* would do such a thing.
    
    ->Ivan_U_Q1

* That's impossible for me to answer, Mey. I don't know the full situation then.

   Fair enough. I guess I was just curious about how you understand your own balance. 

* No, I want to build my own world first before merging it with others.

    I didn't expect you to be so determined like that. But I'm glad to hear it.

* Do you regret your decision, Mey?

    No. At this stage, I made a decision decades ago. It's not even possible to imagine what I'd be if I choose otherwise. I've accepted my decision. But sometimes it does make me wonder.

- But surely, for you, there is something more than what you're doing now?

* Yes, this job is temporary...I'm not sure what I'll do afterwards yet.

- Listen, I don't exactly know what your future bears for you.

All I can say is: don't ignore your passion. You need to follow it, make sense of it, hold onto it, because it's already a part of you. And you deserve to be proud of that.

Maybe it'll take months, years and decades to find the proper words for it. But at least you know you were following something that others will never have...

* ...thank you...Mey. But perhaps we should move on.

- Yes, let's move on. What should we talk about next?

->A2_Hub

== A2_Next_Step ==

...but why do you need to do that?

* The Sea records memories. But memories are just that: memories. You are more than those bits and pieces of your past.

** In order to know how the Sea keeps you together, I need to understand how these memories matter to you. So I have a better idea who you are as a person. This is important for producing the memoribilia.

- ...but why don't you just ask me? Why are you the one telling me who I am?

* {A2_Ivan} Remember you saying how you knew yourself through Ivan? Sometimes we forget who we are like, because we are so concerned with what to do and how we come across.

* {not A2_Ivan} Sometimes we forget who we are like, because we are so concerned with what to do and how we come across.

- 

* I promise I'll make it as accurate as I can, it's my job. Only I know how to perform this task properly for the Machine. I was trained for many months on this.

** This is a necessary procedure for the Sea, Mey. I wish there's a better way to do this.
        
- Okay...but can you at least ask me about what you have figured out. 

I don't want you to have the wrong impressions. You barely know me. Something ought to be inaccurate.

* I will try, Mey. Thank you for your understanding.

- Blended image effect is affected by the ratio of resonance between the images that surface: typically the top two images. If resonance of the first image is significantly higher than the second, the image will lean more towards the top one. # self

I can also bring back Mey whenever I want now # self

~current_stage = 4

\=== You have reached the end of the content! \====

-> END

-> A2_Hub

== A3_Ending ==

afdas

-> END
