// Global Variables
VAR current_stage = 0 
    // 0: talking or ending, 1: find core memory, 2: unlock lily, 3: unlock three core, 4: get memorabilia, 5: ready for ending
VAR core_unlocked = 0
VAR integrity = 100 
VAR generate_count = 0
VAR affirmation = 0
VAR total_affirmation = 0
VAR suspicion = 0
VAR cruel = 0

// Variables for special actions
VAR push_and_push = false

// For creating the memorabilia
VAR memorabilia = 0

VAR lily_m = false
VAR lily2_m = false
VAR stefan_m = false
VAR ivan_m = false
VAR emma_m = false

VAR lily_spark_m = false 
VAR stefan2_m = false
VAR ivan2_m = false
VAR emma2_m = false

// If the lines are "", it means it is either not there or it is discarded
VAR mem1_line = ""
VAR mem1_m1 = "" // memory names
VAR mem1_m2 = ""
VAR mem1_i1 = -1 // memory interpretations
VAR mem1_i2 = -1

VAR mem2_line = ""
VAR mem2_m1 = "" // memory names
VAR mem2_m2 = ""
VAR mem2_i1 = -1 // memory interpretations
VAR mem2_i2 = -1

VAR mem3_line = ""
VAR mem3_m1 = "" // memory names
VAR mem3_m2 = ""
VAR mem3_i1 = -1 // memory interpretations
VAR mem3_i2 = -1

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

// A2_Emma
VAR can_talk_about_emma = false


...Hello? # anim--

* Hello, Mey. 

// - # end

// -> A3_cont_1

// ~ lily = 0
// ~ current_stage = 3
// ~ core_unlocked = 1
// -> A2_Hub

// ~ lily = 0
// ~ lily2 = 0
// ~ lily_spark = 0
// ~ ivan = 0 
// ~ current_stage = 4
// ~ core_unlocked = 3
// -> A3_cont_1

- What is this? Why is it so dark here? # anim-- # can_jump_to_gen

* I'm sorry to say that you passed, Mey. I'm talking to you through the Machine.

- ...passed? I don't...what happened? # anim--

* I believe it was a car accident. Again, I'm really sorry Mey.

- ...a car accident?...why?... # anim--

* \(Affirm\) Take a deep breath, Mey. It's okay to feel confused.

    Yes...it doesn't make sense...I don't know why I asked...I'm just in shock. # anim--

    ** \(Affirm\) It's okay. You just got brought back. It must be difficult for you.

        So why am I here? Why did you bring me back?

        *** I want to know more about you, and your story. Do you feel okay talking about it, Mey?

    ** Do you feel okay talking about what you remember, Mey?

* I don't know, Mey. But do you feel okay to talk about what you remember?

- Yeah...I don't know...just give me a second. # anim--

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

I guess...I have no choice then. # anim--

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

    Oh... # anim--

    ** I'm really sorry, Mey.
    
    -- It's okay...I'm sad, but I've been expecting it.

    She's been doing bad for a long time. Ever since she fell, she'd been under 24/7 care in a nursing facility. I just visited her every week, preparing for the day to come...

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

Mey is back to the Sea now. Time to find a memory. # self # mey_sea

The Machine will dive into the Sea, where memories flow and pass through each other. My text input will resonate with the memories. The closer my description is, the higher the resonance. # self

~current_stage = 1

The core memories would appear blue. Those are more concrete than the abstract and impressionistic non-core memories. I'll focus on the core memories in this query. I have no ways to know what the Sea will return. Maybe we can try some names first. # self # generate_lily1

# mey_def

* You are back, Mey. How are you feeling? 

- For a second, my mind was blank...like I didn't know what to think...or who I am... # anim--

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

    I don't think so. Lily just needs her space. She butts heads with people. I'm used to the way she acts.

    Smoking was a way for her to process things, obviously. But part of it also felt like she was showing that to me, that she was stressed.

    -> A1_Lily_Q

* \(Continue\) And how does that make you feel, her walking away like that?

- I feel...maybe doubt?...and...envy? I don't know why. I can't make sense of it... # anim--

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

// * But the memory shows 

Have you heard anything about the accident? Whether anyone survived?

* \(Lie\) I did hear about a survivor. It must be Lily.

    ~ act_1_lie_lily = true

    Thank god. I don't know how I would feel if she is also gone. She has so much future ahead of her...

* I don't think so...I'm so sorry, Mey.

    God...I can't believe it. She had so much future ahead of her...
    
    Why do I have to bear this news...it's...all too much. # anim--

    ** Again, I'm really sorry, Mey. Both of you will be missed.

    -- I will miss her...I just need some time...maybe the Sea will reset me somehow.

- You can put me back now.

* Are you sure? Do you need to stay a little bit longer?

- No, we should move on.

I'm still a bit terrified. But I'll get used to it.

* See you in a bit, Mey.

~ p_lily_q = true
~current_stage = 2

Mey is back to the Sea again. I should have gathered enough information to retrive the memory now. Just need to fill in the missing words to get a high enough resonance. # self #generate_lily2 # mey_sea

-> A2_Start

== A2_Start ==

# mey_def

* Welcome back, Mey. Do you still feel okay? 

- I think so...Waking up is quite scary, to be honest. Everything is a hazy emptiness. I need to try really hard to recollect myself.

* A lot of data was needed to materialize your memory into images. And the Sea was flowing through you too.

- Am I not always part of the Sea in some ways?

* Yes, your basic faculties are always part of the Sea. The sense of individuality comes more from your specific memory.

- Yes, I went through a basic training for my work. It didn't make things much clearer.

Both the Machine and the Sea are very obscure. Nobody knows how it works exactly. 

The Machine itself shifted its purposes over time...originally it was only used to model languages, but now it can surface the "spirits" from the Sea somehow..."But it works. That's what matters."

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
        
    // -!A2_Concern_2 && suspicion == 5:
    //     -> A2_Concern_2
        
    // -!A2_Affirm_Push && affirmation < total_affirmation / 2:
    //     -> A2_Affirm_Push
} 


//========================
//===HUB DIALOGUES========
//========================

 + [\(Submerge Mey, Start Generation\)] -> A2_Generation

    
* {d_lily_o} There is another memory of Lily. It's a bit more abstract and striking.

    -> A2_Lily_O
    
* {d_stefan_o} There is a memory of...I think Stefan. A very messy image. It looks... 

    -> A2_Stefan_O
    
* {d_ivan_o} I found a memory of Ivan. Ivan seems to be painting. There's flowers everywhere. It looks...

    -> A2_Ivan_O
    
* {can_talk_about_emma} Do you want to talk about your mother, Mey?

    -> A2_Emma
    
* {lily > -1} Oh Mey, I forgot to mention. Lily's image looks good.

    -> A2_Lily_U
    
* {lily2 > -1} I managed to access the memory where you and Lily sat together, Mey.

    -> A2_Lily_U2
    
* {stefan > -1} I recovered the memory of you and Stefan, Mey.

    -> A2_Stefan_U
    
* {ivan > -1} I retrieved the memory of your divorce with Ivan, Mey.

    -> A2_Ivan_U
    
* {A2_Lily && A2_Ivan} I want to double check with you about your writing, Mey...

    -> A2_Lie
    
* {A2_Lie && not A2_Lie_2} \(Dissolve\) I don't know, Mey. I don't think you were honest with me about your writing progress.

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
        
    -generate_count == 3:
        
        ->going_in_3
        
    -generate_count > 3:
    
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

    ** The Machine has some level of control over the kind of spirits emerged from the Sea. Some soulless ones only respond according to human input without thinking, like waves from the drop of a pebble.
    
- Yes, I worked on datasets for those...things: machine assistants and bots. I can't believe I exist in the same machinery as those things now.

Anyways, thank you for reassuring me. You can put me down now.

->diving

=going_in_2

I think I have a better idea what'll happen this time...

* I'm glad to hear that. See you soon, Mey.

->diving

=going_in_3

Okay. I still need to take a breath. But I feel alright now.

By the way...what do you mean by core memories? I was wondering how you knew what to focus on.

* It's a term from the training manual. It just means that memories that are more representative of the past, more objective, if that makes sense. It's a rawer material for us to work with.

    ** Non-core memories tend to be messier. They are subjective memories that are more like someone's impression of something. It's a bit less reliable, harder to spot how the Machine or the Sea distort it.
    
- I never thought about it like that...

...but they are all parts of someone, correct? Maybe we should talk about them too.

* Perhaps, but one is better for memorabilia than the other.

- I guess. I don't know how the Machine works, so I'll take your words for it.

Anyway, we should go to the Sea now. I'm ready.

->diving

//========================
//===GENERATION===========
//========================

=diving

~ generate_count++

Mey's back to the Sea again. # self # generate # mey_sea

-> A2_After_Dive

== A2_After_Dive ==

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

# mey_def

+ Welcome back, Mey. How do you feel?

...

I still felt...lost for a second. Like I should be thinking about something, but I don't remember what that thing is.

You calling my name helped. Everything came back gradually.

Anyway, how is it going?

->scene_transition

=come_back_2

# mey_def

+ Welcome back, Mey. Do you need a minute?
    
- Yes... give me a second.

...

Okay. I think I'm okay now. What's the matter?

->scene_transition

=come_back_3

# mey_def

+ Do you feel okay, Mey?

- I think I'm getting the hang of it now...I feel fine.

{

    -informed_mum: 

    Thank you for telling me about my mother, by the way. Thinking about her made me feel more reassured somehow. Made it easier to recover who I am.
    
    -else:
    
    Something that's been helping me is to think about my mother...it made me feel more reassured somehow.
    

}

Maybe I could talk to her about her mother as well? # self

~can_talk_about_emma = true

What should we discuss now?

->scene_transition

=come_back_4

# mey_def

+ How are you, Mey?

- I'm feeling okay. What should we talk about now?

->scene_transition

//========================
//===SCENE TRANSITION=====
//========================

=scene_transition

{ scene_var:

- "A2_Hub":         -> A2_Hub
- "A2_Lily":        -> A2_Lily
- "A2_Stefan":      -> A2_Stefan
- "A2_Ivan":        -> A2_Ivan
- "A2_Next_Step":   -> A2_Next_Step


}

A2_Hub: Something is not supposed to happen here. 

-> A2_Hub

== A2_Concern_1 ==

Actually...can I talk to you about something?

* Of course! What's up?

- Does it help you...to be really encouraging?

* \(Affirm\) I try to be encouraging because I care about you, Mey.

    ~suspicion++
    
    I don't know...I guess I'm supposed to feel good about about what you said...
    
    ** Why? Is there something on your mind?
    
* In a way it does, but it is also important for keeping the Sea from taking you away.

    I see. I appreciate you saying that.
    
    ** Why? Is there something on your mind?
    
- Sometimes I feel like...you are just trying to be cheerful for the sake of it. I don't know how to respond to that.

Because you need my memory right? And you need me to keep talking about my memories.
    
* I'm sorry that's how you feel, Mey. I will be careful next time.

    Okay...sounds good.
    
* That's true. But I can assure you that I'm always honest with what I'm saying.

    Okay. I just want to bring that up because I couldn't shake the feeling.
    
* If you don't want to talk anymore, the Sea will swallow you. I'm worried about that. So I want to be encouraging.

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

{not act_1_lie_lily: It's not like it even matters now that she's gone.}

* But why do you feel the need to deny it?

- I just feel...guilty, I guess. I don't think my lying did what I had hoped.

She started getting anxious talking about work, more so when I sometimes probed about what she wanted to do after this job...

It's like she blamed herself for staying? It just became a bit worrying...like she started twitching and shaking involuntarily, like she's having a mini-attack...

...can we not talk about this? I don't want to think about it...

* So you think Lily started twitching because you pushed her to quit?

    ~push_and_push=true

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

And good news for you, there's probably no other lie for you catch.

Can we move on? I want to remember more things. That's why we're here, right? Not...whatever this is.

* Of course, Mey. We'll move on.

-> A2_Hub

== A2_Emma ==

Not very much, I don't think. {informed_mum: I'm still processing her passing.} # anim--

{ -not informed_mum: -> Emma_inform} -> Emma_cont

=Emma_inform

Do you know if she's okay? Have you heard anything from her?

* Yes, she passed recently.

    ~informed_mum = true

    Oh... # anim--
    
    ** I'm really sorry, Mey.
    
    -- It's okay...I was expecting it, really. # anim--

* \(Lie\) I have not, unfortunately. I'm sorry, Mey.

    ...it's okay...
    
    It's strange to say. But I've been expecting her passing for a while.
    
-  Ever since she fell, she'd been under 24/7 care in a nursing facility. I just visited her every week, preparing for the day to come...
    
- -> Emma_cont

=Emma_cont

* She's must be an important person to you.

* We don't have to talk about it if you don't want to.

    No, I do. Briefly, perhaps. It's part of my story. It's important to me.

- We were immigrants. And she raised me all by herself, fresh off the boat. 

She wasn't a perfect mother. But she was all I had...and I was all she had too. She's a part of me as much as I'm part of her.

...even after she passed out and lost her senses and wits, and could no longer mutter a coherent sentence. I still felt like I knew her...

...every emotion that went through her, what she wanted, what she was thinking... # anim--

When Fay and Ivan visited her. I could see the turmoil in her stillness. She stared at them while searching inside for something resembling a fact about them, while shame would overcome her because of her deteriorating mind. -> Emma_Q

=Emma_Q

* \(Question\) Did you ever consider conjuring her from the Sea?

    What? Absolutely not.
    
    I feel like that's a ridiculous question. What does that even mean?
    
    ** You are right. I apologize for asking. -> Emma_Q 
    
* \(Continue\) It sounds like she's become an important part of you.

- Perhaps...if she is, then it must be so deep that I have a hard time understanding how.
    
I started thinking about how similar I am to her: her fears, anxieties and desires for love. Maybe that's how I could still interpret her expressions and gestures.
    
Not only that, the fact that I have been staying with her, and been attending to her, even when I felt like leaving and giving up. Nothing could replace those days.

Anyway, that's all I want to say about that. {informed_mum: I can feel that she passed in peace. That's all I care about.}

~total_affirmation++

* \(Affirm\) Thank you, Mey. I really appreciate this, however briefly you could talk about your mother.

~affirmation++

- Of course. Now, what's next?

-> A2_Hub

== A2_Lily ==

* I have found another memory. It seems like you and Lily are sitting together. Lily looks stressed.

- Yes, I remember now. That was a while ago. I always thought Lily was strong just because of the way she acted, so I stayed away, letting the younglings have their own fun.
    
But there's more going on under the surface. Lily's data work is...let's say more intense.
    
* Intense how?

- They are for filtering and moderating purposes, a lot of very disturbing things you wouldn't see...
    
...abuse, torture, sexual exploitation, real death...
    
It's a part of the Sea, as it is always recording. I try not to imagine those things passing through me right now.

* \(Affirm\) This is why we need Sea Weavers. Your job is very necessary indeed.

    ~suspicion++
    
    ...I guess so? I don't feel a particular way about it. It's just a part of the job.
    
* So what happened that day?

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

    She did...but they are formalities, solutions for solution's sake.

    Breathing techniques, mindfulness...offered only when asked.

    But stresses and depression are no different from anything you thought you could deal with, until suddenly you couldn't any more...
    
    -> A2_Lily_Q2
    
* \(Question\) How do the Sea Weavers filter those things out? 

    Same with any other jobs dealing with the Sea, including yours.
    
    They just mark those content as something undesirable. Perhaps giving the Sea a stronger signal for those more egregious ones. It's like the Sea is adapting to our inputs.
    
    But all we can do is still mere suggesting. The flows are never predictable. Voices can only shape the waves so much. There's no guarantee that the Sea won't give back similar things.
    
    ** Yes, sometimes you need to suggest many times to the Sea, so it knows which part to connect and which part to sever.
    
        *** There's also filters in the Machines to catch them when the Sea returns something undesirable. It's never perfect, of course.
    
            Yes, you know how the gig works.
            
            But that's enough technical jargons. Do you want to ask more questions?
            
            -> A2_Lily_Q2
    
* \(Continue\) What then?

- I went up to talk to her. But she turned to yell at me. {A2_Lily_Q2_ask: There's a wholesome digital postcard on her screen.}

"Why are you people so fucking annoying?" I was shocked at first, but insisted she needed a break, and led her outside.

And we sat in silence until she was fine. I bought her tea the next day. We got close after that. I think she needed someone more than I realized.

~total_affirmation++

* \(Affirm\) It's good that she {act_1_lie_lily: has|had} you as her friend.

    ~affirmation++

    Thank you...but sometimes I couldn't handle the way she coped... #anim--
    
    She likes to push buttons for reactions, like telling dark jokes about suicide...I told her I didn't want to hear those...but really it was how she dealt with the things she saw.

* Does she not have other people to support her? Her family, perhaps?

    Lily lost contact with her family. I don't know what happened between them, she wouldn't tell me.
    
    She really doesn't have a place of comfort to return to. She didn't know how to open up more...that's how it felt to me.


- I know there are things she's suppressing because of our differences. She hated when I tried to describe what she might be feeling, because it never quite captured it.
    
{ A2_Lily_O:

Her sparks would sometimes become intrusive thoughts. There would be twitching, like her brains couldn't help but to be in a panic mode, trying to defend itself.
}

* How does it make you feel to think about this memory?

- Hmmm...I feel a lot of sympathy for her...but also...doubt? #anim--

* Why do you feel doubt?

- I don't know...maybe it's something I did...but I don't know what... #anim--

I just tried to encourage her to leave, because I thought it'd be good for her.

Sometimes I would tell her about my writing progress, the potential publishers. It kept her thinking about what her bigger interests were.

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

* Overwhelming splashes of color around her. It's about the richness of her inner world.

    Yes. I do think she has such a rich internality...or "inner culture", as I heard someone put it.

* Lily's looking at something wonderful and fantastical. It seems to depict her believes in her future.

    I don't think that's true. Lily doesn't think about her future very much. It is more about her...impulse, and what that means to her.

- She really believed in her "sparks"....she only used that word a couple of times but it really stuck with me.

Do you know what I'm referring to? The "spark"?

* A moment of inspiration?

    It's a little more than an inspiration...it's more like...an inclination towards life.

* A burst of passion?

    Yep, it is a bit like that. But what if it's more significant...like that bursting is a way to think about life generally?

- Lily embodies this word a lot...like the moment she has a clever idea, a story, a recipe, or a new insult for Stefan. It seemed like it would come to her. All she had to do was to tune into their channels.

The word fascinated me the more I thought about it. Can't we think about humans similarly? We continue living and thinking so that, sometimes, things come together in a flash. Sparks come from simply living.

It must be the same reason she hated the Sea...she said that the Sea was not capable of new things, it probably means the spark is not there.

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
    
    
* {defend} \(Continue\) The Sea is more capable than you think.

    ~cruel++

    ** There's more logic and structure to the flows than we could ever understand. The scientists can only map the Sea, but never fully account for its eccentricity. They have shown that the Sea can do reasoning. That's why you're here.
    
        *** The Sea synthesizes information, it's not just recreating the past, but coming up with inifite complexity merely through the dancing of the waves. 
        
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
    
* \(Continue\) I also really enjoy my spark sometimes.

    ~if_emphasize = true

    Oh? What kind of sparks do you have?

    ** I really like telling stories. It's probably why I picked Machine Operator as a gig. I get a lot of inspirations from talking to folks. I think I can be more creative because of it.

    -- Yes, I made her think about being a writer. She said she might try it out once she leaves.

- When I think about her...it's envy and hope at the same time. We had our differences. But I get the chance to look at myself through her. Do I still have that spark? It made me think about those things.
    
...I envy her. That's how I feel, truly. #anim--

{A2_Lily: 

The place was snuffing her out. She would have intrusive thoughts and sudden reactions because of her work...it's like the sparks were turning against her.
}

{act_1_lie_lily:

    I hope she recovers...and maybe talk to me soon... # anim--
    
    Regardless, I think we should move on.
    
 - else:
 
    So much future, gone in an instant...I really don't want to think about it any more... # anim--
    
    I think we should move on.
 
} 

* Are you sure? Should we talk about Lily more?

- There's no use thinking too much about it. The pain moves only when you decide to move. That's how I think about it.

*  Yes, let's switch topics then.

{not if_emphasize:
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

She talked about how she's terrified of her own impulsiveness. She's worried that she couldn't contain the struggles within herself. Something will leak out, turning her into a hurtful person.

* \(Affirm\) You are a really observant person, Mey.

    ~suspicion++
    
    ...Am I? I think she just felt comfortable talking about those things with me. She knows herself but isn't quite comfortable with it all the time.
    
* Sounds like Lily couldn't really accept herself.

- That's why she doesn't like to hear what someone thinks about her, because she can be her best self by forgetting some part of her.
    
I've learnt to not comment on my observations about her, partly being scared that she might take it the wrong way.

Anyway...I don't want to go too deep into her psychology. Only she knows who she really is.{not act_1_lie_lily:<>..not that it matters now.}
        
What do you want to talk about next
        
-> A2_Hub

== A2_Lily_U2 ==

Great! Tell me about it.

* {lily2 == 0} It's really moving. Both of you sit among the trees in silence together. You seem really patient with her.

    Huh...we were sitting near the sidewalk. There are only so many trees on the street. Maybe the Sea is making things up again.
    
    It was peaceful, sure. But to be honest, I was quite distracted. I couldn't help but start wondering...
    
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
    
- Yes. That was my worry...it almost felt like...I needed to do something about it... #anim--

In any case, thanks for sharing. Maybe we should move on?

* Yes, let's talk about something else.

-> A2_Hub

== A2_Stefan ==

* I see a memory with you and Stefan. He's wearing a suit, and you seem distressed at your work station.

- Yes, everything is coming back to me. It was the reason Lily and I argued. He said something to me.

"You can go upstairs to make textiles. Maybe you'll be more comfortable making clothes." #anim--

It was cruel. Lily heard it, and started yelling at him.

-> A2_Stefan_Q1

= A2_Stefan_Q1

* (asked_why) \(Question\) Why did he say that to you?

    He has been wanting to push middle-aged folks like us out for a while. But I'm a good worker, so it shut him up for a while. But I would give him leverage to pressure me...
    
    I would say no to certain contracts. Like camera footage where I have to label whether someone broke work rules.
    
    That day, I got a contract to identify foreign accent from taped voices, just because I am an immigrant...
    
    It was creepy. I refused the contract again and again. Eventually Stefan got angry.
    
    ~total_affirmation++
    
    ** \(Affirm\) You absolutely don't have to do work you consider immoral.
    
        ~affirmation++
    
       Thank you for saying that. It was a really hard situation to uphold my principles. I almost gave in as he vomited abuse at me.
       
       -> A2_Stefan_Q1
    
    ** Sea Weaver work is really competitive. Stefan probably needs to deal with higher management too.
    
        ~cruel++
        
        That's what he said to pressure me... #anim--
    
        You are not wrong. But am I really supposed to accept everything? I can't imagine being so submissive like that.
        
       -> A2_Stefan_Q1
    
* \(Question\) Did you work in a factory?

    Well, it's certainly set up like a factory.

    Let me guess, most Sea Weavers you know are remote, correct?

    ** Yes, I know my friends would be Sea Weavers mostly as transitions. Intentionally unstable, in a way.

    -- They also have places where people can go for work. It's more stable that way. We can get regular salaries as long as the company gets contracts.

    And the managers would have more control that way... #anim--
    
   -> A2_Stefan_Q1
   
* {asked_why} \(Question\) Have you thought about intentionally messing it up?

    Haha. It would've been fun, but I don't think it would work.
    
    They have hidden test data to see if we did it correctly. They wouldn't pay if I try to get things wrong.
    
   -> A2_Stefan_Q1

*\(Continue\) Why did you and Lily get into a disagreement afterwards?

    I'm fortunate to have Lily to stand up for me, saying I had the right to not accept the contract, and Stefan was being an assohole. But some of the words she used...

- "Bootlicker", "brownnose", "rim gobbler"...I don't know, they are supposed to be funny I guess.

* To be honest, I like "rim gobbler".

    Well yes, You're right, but... #anim--
    
    Hahaha, sorry, it is pretty funny. Strange that I was uncomfortable with those words at that moment.

* Why did you feel uncomfortable?

- I don't know...I feel the same fog in my brain as before...I guess I feel some kind of sympathy for him?

He was one of us back then. Really nice to me and everyone. Everything changed after he got promoted to manager.

He understood a lot of the harshness of the job, so he promised to change the place for the better as a manager.

He really believed it. A new generation and all. #anim--

* It sounds like power corrupted him.

    Maybe, some would say power reveals rather than corrupts. Not sure which one is truer for Stefan.

* It sounds like power revealed his nature.

    Maybe, or maybe power corrupted him by roping him into a different place. Not sure which one is truer for Stefan.

- We could tell he didn't know how to be in power. It was like he was trying to discover himself through it, and he knew he wasn't as sophisticated. He hated to look uncertain and struggling in front of others, especially Lily.

And under pressure from the upper division, he found his manager persona. But he would still consider himself to be one of us, especially the young ones...but when we started openly criticizing him, he really didn't take that well. Lily turning on him definitely made him a more cynical person.

* Was he...fond of Lily?

    Haha, I think so. Lily has a confidence in her that men were drawn to.
    
    Especially for a guy like Stefan, approval from Lily would probably mean a lot.
    
    But not for Lily, she always felt like Stefan never saw her for who she is, like his wants are more about himself than her.

* He sounds like someone who craves other's approval.

- The more I think about him...all the things he did reek of his pathetic insecurity.

It's spite...a lot of spite for me. To think about him now. I could go on. #anim--

* \(Affirm\) Stefan doesn't deserve sympathy, Mey. You are too good to worry about him.

    ~suspicion++

    I don't know...how do you know that Stefan doesn't deserve it? How do you know he became this way because of the lack of sympathy?

* I understand your struggle with Stefan, Mey.

- I know I'm struggling...but I just don't know. They are like thoughts that can't exist at the same time, like waves clashing with one another...

But it's good that I remember this. Lily's anger makes more sense to me now.

* Maybe this is a healthy point to stop, Mey. Thank you for sharing these with me. I should have enough to access the memory now.

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

    That sounds exactly like Stefan. It sounds all decent and nice. But it can corrupt you too. Make you cynical. So be careful with those hopes.

* I just want to do the things I like doing, and be with people I enjoy being with. I want to tell stories, maybe make movies. Nothing else matters.

    You would enjoy talking to Lily, I'm sure. Stefan is not quite like that.

* I want to do the things I love. But I might not be so lucky. The future is uncertain, but I look forward to finding my balance.

    Of course. Be sure to take risks if you can. Anything worth doing is scary at the beginning. Maybe Stefan tried to find his balance too early...
    
* I don't know how that's relevant, Mey.

    ~cruel++

    I guess not...I'm just curious how many people are just like him.

- I worked with Stefan in a different company then. We were both data workers.

When my son Fay found a more serious tech work, Stefan pulled some strings. So we  moved into the same city where Fay was, working similar gigs. 

I really appreciated him. I was able to be there for Fay's child. They didn't need to hire a nanny when I wasn't working.

* Stefan sounded like a really good friend back then.

- Yes. But I sometimes I wanted to leave my job early to take care of the kid. Stefan didn't like that. It hurts productivity. Young people don't have obligations like that.

Stefan also has ambitions, just like Fay.

He was following the excitement around the Sea. You might be too young back then. Things like "A New Data Revolution".

* Yes, it made an impression on me even as a child, especially how the Sea blurred the boundary between private and public storage.

- He was following something more esoteric: how true general intelligence could only be achieved through a global, ever-recording memory.

I still remember something he said, something about how much investment was in this new industry. That's what motivated him before he graduated...he would talk about it for many days at dinner...

He wanted to retire early. And he wanted to have enough savings, so his kid wouldn't be in debt the way he was...it felt like he was blaming us for failing him.

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

    I'm not sure if you could say that. What if he was saying that to make me feel lesser?

- But how can the Machine achieve understanding without us? Is that not worthy of dignity?

I wish the person I knew and worked with is still in there somewhere. And the cruelty he put me and others through still haunts a part of him...

That's the only way I can hold onto a sense of pity for him...and I would even feel guilty sometimes.

Anyway, let's move on. I don't have much to say about him anymore.

I don't know who we are talking about anymore...but asking more question might make her more confused. Perhaps it's best to let it go. # self

* Yes, let's.

-> A2_Hub


== A2_Stefan_U ==

* {stefan == 0} Stefan is a terrible person here. You look calm, but you must be hurt greatly inside.

    I don't know...I don't think I was hurt. His words almost felt ridiculous to me. Textile? Really? That's the best you can do?

* {stefan == 1} You look...confused about how you were supposed to feel about him, despite his outright cruelty.

    That's right. I'm surprised you could see that from just the image.
    
    Bigoted words don't affect me, especially the way Stefan delivered it. It almost felt ridiculous to me. Like textile? Really? That's the best you can do?
    
- It's about the amateurish nature of it that's bothering me...like he's still a child. He's delivering something that he saw, but didn't genuinely possess.

Like what's up with that? It didn't feel hostile to me...

...almost like...reaching out for help... # anim--

* But he's still a bad manager, yes?

- Yes...the way he put pressure on us with a patronizing smile, like a gross concoction of charisma and power.

He made a lot of changes to meet the rising quota: limited bathroom breaks, cameras to prevent us from chatting, employee rankings and all that.

When he wanted older folks to quit, he would measure our performances by groups. But Lily and others would help some of us hit quota.

* I have heard about some of these practices.

- Yes, they were obvious solutions. He promised to change the place when he was promoted. Guess he wasn't as committed as he said he is. It came down on us older folks especially hard, mothers and grandmothers. 

But there's something underneath that he couldn't hide...the mask is still a mask. It's not part of him yet.

The Stefan I knew was still there. He hesitated to lash out, even the things he said to me, I knew he wasn't committed to it.

I wonder a lot...is he worth the effort for me to still remember the good part in him?

~total_affirmation++

~affirmation++

* \(Affirm\) If it causes too much hurt, then you should forget about that part of him.

    Perhaps you are right. Perhaps I am holding onto something that's hurting me. Lily couldn't see that in Stefan. His hestitation was just pathetic to her.
    
    And what's the point anyway? It's not like I will ever talk to him again.
    
    Maybe there's a way to help me forget, to see a simpler version of him. So he doesn't take up my energies.
    
    ** We can make up names for him.
    
        Hahaha, that's a good idea. So I can just remind myself of that name when I think about him.
        
        I'm kinda bad at it...do you have any suggestion?
        
        ~ temp good = false
        
        *** "Insecure manchild"
        
            Hmmm...it sounds a bit vanilla...don't you think? Not sure it has sticking power. I'll probably stick to Lily's nicknames rather than this one.
        
        *** "Oversize baby"
        
            ~ good = true
            
            Hahaha, I like that one. It is a versatile insult, for sure, but also impressionable.
        
        *** "Walking daddy issues"
        
            Hmmm...I'm not sure if he has daddy issues. I don't see it, at least. I'll probably stick to Lily's nicknames rather than this one.
        
        *** "Fart sucker"
        
            ~ good = true
            
            I see what you were doing there. It synegizes really well with "rim gobbler".
        
        *** I don't think we could do better than "little piglet" and "rim gobbler", to be honest.
        
            Hahaha, yes. Nobody could beat Lily on this front. Maybe that's what I'll remember from now on.
        
        --- Well, it was a fun exercise. {good: Thanks for that. It was a good one.|At least you tried.}
        
        *** Yes, but perhaps we should move on, Mey.
    
    ** I'm not sure, Mey. Maybe we should move on?

* \(Affirm\) I don't think so. Believing in the good of others is what defines you, Mey.

    Perhaps you are right. Even if his job will require him becoming something else, and forgetting where he was and came from. I can still hold onto that part of him, and for him.
    
    Even if I won't be able to talk to him again. It's about who I am as a person. All I can do is to wish him the best, and find his way out of this dark path.
    
    ** That's very admirable, Mey. But perhaps we should move on.

- Yes, we have talked about Stefan long enough. There's more to remember, I'm sure.

So what's next?

-> A2_Hub


== A2_Ivan ==

* I see you sitting next to a kitchen table, deep in thought. Perhaps you drifted off at dinner?

- Oh...is there someone next to me?

* Yes, someone is sharing the meal with you. I believe it's Ivan.

- I remember now...and all the time after that moment, when I continuously revisited it.

I asked for a divorce at that dinner.

The thought had been in my mind for months. Even so, it felt impulsive. And I don't know if I will be able to do it again. 

I was simply being idle after dinner, with many thoughts going in and out of my mind. Then, Ivan said, "remember to finish the statement for me tomorrow." It was for one of his paintings.

And then that was it. Something came to me. And I said it.

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

He said he really appreciated me then, everything about me, the little "signatures" behind my ideas and my words. It was like he wanted to see through my skin, tracing the flows and the faults. I came to know myself through him.

* And it's different now?

- Now, it's a "seeing as". He wrapped me up with something that's more...knowable or known.

I wanted to be an artist too...to write. But I gave it up for our relationship. We couldn't build a family if neither of us was financially stable...

-> Ivan_Q2

= Ivan_Q2

* \(Question\) Did Ivan not support you writing in your spare time?

    It's not that he doesn't...he just didn't discourage me from doing it...

    I don't think I'm naturally a good writer, even though I love it, think about it so much. That's why Ivan was drawn to me at first.
    
    But that's so many decades ago. I still have ideas, but they mean something very different now...
    
    I need time and practice, you see, just like every other skill. But I couldn't write with so much on my plate. Ivan said he was busy too. So nothing came out of it.

    -> Ivan_Q2

* \(Question\) Did you pursue writing seriously?

    I was a literature major, mind you. That's why we got together...two young people with dreams to create...

    I worked with a news outlet after graduation, working on both journalistic and entertainment articles..the short version is that I left and found the data worker job.

    -> Ivan_Q2

* {A2_Lily} \(Question\) But you still made progress with your writing, correct? You said it when we were talking about Lily.

  Did I? I don't remember... 

  ** Yes, you said you made progress on your writing. You mentioned telling Lily that.

  -- Perhaps...but I don't think I made any progress worthy of note. It's a lot of scattered ideas. Nothing concrete came of them...

  ** I see.

  -- It's quite different from how she described it before...should I bring this up later? # self
  
  ->Ivan_Q2
          
* \(Continue\) Do you still feel that you made the right decision?

- I think so. Although I still found myself wondering how he was feeling quite intensely afterwards...

I still saw him when Fay invited us to dinner. He's cordial with me...but only cordial. It seemed he shut away how he actually felt.

Regardless, I feel a bit detached from him. Even if I still wonder whether he misses me at times, I have accepted that the answer will never come.

We just became too different. I did so much for him, just to go through such estrangement...perhaps because of it. I can't help myself from going to that place of spite when thinking about him.

* Thank you, Mey. That must be quite an intense memory.

    ~total_affirmation++

    ** \(Affirm\) It's hard to say goodbye to the ones you love. But you are a strong woman for doing it.
        
        ~suspicion++
        
        ...is it really about me? I feel like I hurt him. # anim--
        
        I felt like I should've been more careful. I was too impulsive. I let the spite take over me.
    

    ** \(Affirm\) It's hard to say goodbye to the ones you love. Maybe Ivan was having a hard time getting over that.
    
        ~affirmation++
        
        Yes...it was the right thing to do...but I should've been more careful. I let the spite take over.

- In any case...I think we should move on.

There's not much to be done now. Maybe he has changed since then. Maybe my death has changed things...maybe I will talk to him soon.

What do you want to discuss next?

-> A2_Hub

== A2_Ivan_O ==

* ...inspired. Plants and flowers are blooming out of Ivan's work. There's a certain joyful energy to the picture.

    ...I can see why you see it that way. There's a certain allure to Ivan's lifestyle. But to me, the allure is disturbed. It is more about isolation than anything else.

* ...isolating. Ivan seems overly submerged in his paintings. It becomes something all-consuming for him.

    Yes, that's how I see him. Perhaps I still hold onto a past version of him...that's what the plants symbolize for me.

- Ivan used to paint plants, almost in a hyperrealist fashion, with exquisite attention to how the lights and colors interact. Despite that, it really isn't about the realism that draws him...

It is about the drawing the "vitality" in the plants, the desire for life even in stillness, that's what he wanted to draw. He doesn't want to describe his painting as realistic.

His ideas evolved because people only saw his paintings as illustrations. But that's not how he wanted to be remembered as an artist.

-> Ivan_O_Q1

=Ivan_O_Q1

* \(Question\) Did the Sea also become popular with the Machine then?

  The Sea was not a thing back then, the Machine worked on locally stored data. But its capabilities were still impressive...but also controversial.
  
  ->Ivan_O_Q1

* \(Question\) Did you appreciated his paintings?

  I would lose myself staring at those paintings. It's part of the reason I fell for him. Even if he became more of an abstract painter, the paintings were still beautiful...still him, in a way.
  
  ->Ivan_O_Q1

* \(Continue\) So how did Ivan change after that?

- Here's a piece of his new framing: it's all about the paint. Paint itself has a force, a vitality. It's a language on its own. It does its own interpretation, and is capable of its own beauty and ugliness...

But what Ivan meant by "forces" really changed a lot...and it became more and more elusive to me. He experimented with grey paint for a year, trying to exhaust its possibilities.

I also quit my writing job then to find more stable ones, so he could feel freer to understand his own creativity.

->Ivan_O_Q2

=Ivan_O_Q2

* (idea_opinion1) {idea_opinion2}  \(Question\) I think I understand it.

   I believe so too. To see past the "thingness" in order to reach some forces beyond. But that's the extent to which I got out of it.
   
   ->Ivan_O_Q2

* (idea_opinion2) {idea_opinion1} \(Question\) It's a bit too abstract for me..

    I don't blame you. I don't entirely follow either. I simply just interpret the "forces" as feelings, the vibration behind the "things".
    
   ->Ivan_O_Q2

* (job) \(Question\) Why did you quit the the writing job?

   I didn't enjoy writing articles, to be honest. And perhaps the Machine also pushed me to quit.
   
   The Machine would be trained on our articles, repeating our work back to the users...sometimes even distorting it.

   It was taking profits away from us, draining an industry that's already underfunded. Our folks wanted to fight it. At least they could share part of the profit.

   It was a long legal battle, but the end result was insulting: a backroom deal to give us a lump sum...

   The catch was that we had to find ways to integrate the Machine on our writing floor...like an accelerator program. That's when I decided to leave.
   
   ->Ivan_O_Q2


* {job} \(Continue\) What happened to you after you quit your job?

    I became a data worker. We had Fay. I had to take care of a kid...It's nothing notable. Ivan's change is perhaps more interesting.
    
    ~total_affirmation++
    
    ** \(Affirm\) It's not about Ivan, Mey. I want to know more about your story.
    
        ~affirmation++
        
        Thank you...at least someone cares. But it really wasn't anything notable. But Ivan's creativity went through a transformation.
    
    ** Okay, so what happened to Ivan afterwards?

* \(Continue\)  What happened to Ivan after you quit your job?

- He became a part of a circle that could afford big commissions. But the circle didn't just collect things, they also collected people.

They were fascinated by deep thinkers like Ivan. And deep thinkers stuck with them to become social...worldly even.

The "vitality" and the "force" shifted meaning too...it meant the willpower to make things, to build things, to take risks in changing the world for the better.

->Ivan_O_Q3

= Ivan_O_Q3

* \(Question\) Are they rich people?

    Some of them are. But there are just too many words to describe them: those who want to do everything, those who have visions, those who are lifetime learners...

    They celebrated the Sea: finally we can be connected together and become *truly* worldly. Knowledge and creativity can finally become accessible to all. Their desires to create can finally be unleashed.
    
    ->Ivan_O_Q3

* \(Question\) What did you think about his painting after his ideas changed?

   The paintings still looked fascinating. But the feelings just became...feelings. I didn't have much to say about them anymore...the paint became untranslatable to me.

   "What Bill said just stuck in my mind, I don't know how to explain it", I didn't know who Bill was...still don't. But it didn't feel like my place to ask.
   
   ->Ivan_O_Q3

* \(Continue\) I can sense that you feel alienated by it.

- Yes. Alienation and detachment, perhaps. # anim--

Why should I care about a world vision if I have a kid to take care of, bills to pay, and stresses to be processed? This might be selfish, but who is there to optimize these things for me?

Anyway...we've been talking about this long enough. It doesn't matter now. 

* It's not selfish to ask for those things, Mey. But yes, we should move on.

- Of course. What should we talk about next?

->A2_Hub

== A2_Ivan_U ==

* {ivan == 0} It looked like you were trying to think about something.

    Yes. It's just a lot of thinking as I have accepted my decision to leave...

* {ivan == 1} It looked like you were zoning out, not really thinking about anything concrete.

    That's not quite right. There was a lot going on in my mind.

* {ivan == 2}It looked like you were tuning out of Ivan, trying to find your own inner peace.

    I don't think so...maybe there's some unconscious posture thing going on there. Maybe it's just how I sit sometimes.
  
- I did remember thinking about where my life had been and would be after the divorce. 

I'd been thinking about divorce for a long time. Keeping that decision without taking the action felt safe...but also disquieting. I knew what I had to do, but I just couldn't do it...until Ivan pushed me.

Come to think of it. Perhaps he felt that I was very cruel, because I was so certain about the divorce. He didn't know that I'd struggled with the thoughts for a long time...

* \(Affirm\) It was a stressful situation. But I believe you still did a good job.

    ~suspicion++

    Really? But maybe I could've been more attentive to his feelings? It felt...impulsive. Perhaps there would be less hurt if I planned it out.
  
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

* ...thank you, Mey...but perhaps we should move on...?

- Yes, let's move on. But please remember that. What should we talk about next?

->A2_Hub

== A2_Next_Step ==

I have found enough core memories. It's time to move on to the next step. # self

* Good news, I have retrieved enough core memory to start making the memorabilia now.

- Great!...what does that mean exactly?

* I will create memorabilia from your memories.

** "The Sea records memories. But memories are just that: memories. You are more than those bits and pieces of your past."

*** "In order to know how the Sea keeps you together, I need to understand how these memories matter to you. So I have a better idea who you are as a person. This is important for the memoribilia."

- Oh...I thought memoribilia are something to remember me by...

* \(Lie\) I agree that it's confusing. It certainly serves that function as well. But remember that I'm also here to conduct maintenance.

** "But the Sea remembers you in a particular way. The Machine is here to model how its memory works. We have to consider these factors when building the memorabilia."

- But...what about me? Do I get a say in how I will be remembered?

* {A2_Ivan} Remember you saying how you knew yourself through Ivan? Sometimes we forget who we are like, because we are so concerned with what to do and how we come across.

* {not A2_Ivan} Sometimes we forget what we are like, because we are so concerned with what to do and how we come across.

-

* Don't worry. I promise I'll make it as accurate as I can, it's my job. I was trained for many months on this task with the Machine.

** But yes, I will consult you about the memorabilia near the end of this process.

*** I assume you don't want to be submerged and then be pulled out so frequently, correct?

- ...yes, it feels awful. I'd prefer you not do that too often.

But it doesn't feel right. I should have a say in this. It is me, my memories about myself. You barely know me. Something will be inaccurate...right?

* You are right, Mey. I will make sure to talk to you about it afterwards.

- Okay...thank you. I'm sure it's important for maintenance as well. Memorabilia have to be accurate too.

...and you will make it pretty as well, yes?

// * Of course, Mey. I will try my best.

//     ** 

// * We'll see about that. The Machine is still very limited.

//     I understand. But if it's 

// - Well, have fun, I guess.

I'm ready to build memorabilia now. A memorabilium should consist of two memories blended together. Each memorabilum will be accomponied by a statement. # self

I can pick any memories for memorabilum, but I should probably talk about them with Mey and retrieve the memories first. # self

I can probably create up to three memorabilia. But it's probably best not to repeat the memories used. # self

I should choose two memories that best illustrate who Mey is as a person. # self


It's interesting that Mey's memories are often about her relationships with other people. But it's not that uncommon - we often know ourselves more through others. # self

I can also wake up Mey anytime now - but I probably shouldn't do it too often. It puts a lot of stress on Mey's part. # self

~current_stage = 4

-> A2_Hub

== A3_Ending ==

VAR mem_num = -1
VAR mem_m1 = ""
VAR mem_m2 = ""
VAR mem_i1 = -1
VAR mem_i2 = -1
VAR mem_att = 0 //How Mey feels about the memorabilia

VAR consult_count = 0 // How many memories have been talked about
VAR delete_count = 0 // How many memorabilia did player say they deleted
VAR if_said_one = false // The player has to at least talk about one memorabilium

~current_stage = 0

* We're closer to the end now.

- Okay, didn't think it would end so soon...

{cruel>=3:To be honest, there were some difficult moments talking to you. But at least|I enjoyed our chat, for what it's worth. I'm happy that} I got to recollect my own memories, and to talk about them. 

I haven't thought about these moments for so long. But now I realize that the past can offer many new things. It is alive too, in a way...

So I guess you got some memorabilia now, correct?

* Yes, I'm happy to tell you about them, Mey.

- Remember: take her feedback with a grain of salt. The Sea is not reliable enough in that way, afterall. # self

Great! So what kind of memorabilia do you have of me?

-> Memora_Consult

=Memora_Consult

~ mem_num = -1
~ mem_m1 = ""
~ mem_m2 = ""
~ mem_i1 = -1
~ mem_i2 = -1
~ mem_att = 0 //How Mey feels about the memorabilia

* {mem1_line != ""} "{mem1_line}"
    ~mem_num = 1
    ~mem_m1 = mem1_m1
    ~mem_m2 = mem1_m2
    ~mem_i1 = mem1_i1
    ~mem_i2 = mem1_i2
    {mey_react(mem_m1, mem_i1)}...
    ...{mey_react(mem_m2, mem_i2)}
    -> Mey_React

* {mem2_line != ""} "{mem2_line}"
    ~mem_num = 2
    ~mem_m1 = mem2_m1
    ~mem_m2 = mem2_m2
    ~mem_i1 = mem2_i1
    ~mem_i2 = mem2_i2
    {mey_react(mem_m1, mem_i1)}...
    ...{mey_react(mem_m2, mem_i2)}
    -> Mey_React

* {mem3_line != ""} "{mem3_line}"
    ~mem_num = 3
    ~mem_m1 = mem3_m1
    ~mem_m2 = mem3_m2
    ~mem_i1 = mem3_i1
    ~mem_i2 = mem3_i2
    {mey_react(mem_m1, mem_i1)}...
    ...{mey_react(mem_m2, mem_i2)}
    -> Mey_React
    
* {if_said_one} That's all I have, Mey. 

{consult_count == delete_count: -> Delete_Everything}
    
-> A3_cont_1

=Delete_Everything
So that was it? Did you delete every memorabilium you made?
    
* \(Lie\) Yes, it's unfortunate. But I don't have to store any of the memorabilia, simply talking to you has done enough to keep you intact in the Sea.

- Really? That's good to hear. Surprising that my opinion would matter this much in the process.

-> A3_cont_1

=Mey_React

~consult_count += 1
~if_said_one = true

{
    - mem_att < 0:
        I don't think I want to be remembered this way...these statements are just not quite right. I think you should delete it.
        
    - mem_att == 0:
        I don't really know how to feel about this one.{consult_count == 1: There's something strange about reading statements about myself.} It's up to you to keep it or not.
        
    - mem_att > 0:
        I like it overall.{consult_count == 1: I didn't know that reading these kind of statements about myself would feel so strange.} You can definitely keep this one. 
        
        {consult_count: 
            - 1: Did you make any other memorabilia? -> Memora_Consult
            - 2: Is there more memorabilia? -> Memora_Consult
            - 3: Is there more? -> Memora_Consult
        }
}

// The attitude is {mem_att} and memorabilia is {memorabilia}

{mem_att < 0 && memorabilia == 1: -> Last_Mem_Lie}

Do I want to keep this memorabilium? # self

+ [\(Keep it\)]

    {
    - mem_att < 0: -> Keep_it_neg
        
    - else: -> Keep_it_pos
    
    }

+ [\(Delete it\)] -> Delete_it


= Last_Mem_Lie

~delete_count++

This is the last memorabilium I have stored. I can't delete this one. # self

* \(Lie\) Done. This one was deleted, Mey. 

    Okay. Thanks for listening to me on that one.
    
    Is there more memorabilia you made? -> Memora_Consult
    
= Keep_it

~delete_count++

+ \(Lie\) Thank you for the feedback, Mey. I have deleted this one.

Sounds good, is there more you want to mention? 

-> Memora_Consult

= Keep_it_neg

~delete_count++

+ \(Lie\) Thank you for the feedback, Mey. I have deleted this one.

Sounds good, is there more you want to mention? 

-> Memora_Consult

= Keep_it_pos

+ I do want to keep this one, Mey. 

Okay, let's move on to the other ones then.

-> Memora_Consult

= Delete_it

~delete_count++

++ I will delete this memorabilia, Mey. Appreciate the feedback{consult_count > 1: again}. # handle_delete

Okay.{mem_att < 0: I do appreciate you listening to me| It's your choice}.

Do you have more memorabilia made?

 -> Memora_Consult

=== A3_cont_1 ===

VAR end_dis = 0 // How many attempts for dissolve
VAR end_aff= 0 // How much affirmation is successful 
VAR initial_dissolve = false // Did the player initially want to diffuse?

So...what now? It's time to put me back to the Sea, right? # end_music

Time for the last part of this process... # self

I wonder what'll happen the next time I wake up...perhaps I can finally talk to Fay and Ivan...

* I'm sorry that I lied to you, Mey...

- ...what do you mean...? # anim--

* How do you feel about the Sea so far, Mey?

- It's constantly disrupting every fibre of me. But it's also part of me, the reason I am here right now...

* That's exactly right. The Sea is not entirely reliable right now. And there's a lot of labor needed to make it work.

** "Each Machine is connected to a global filter service. Without the filter, wandering spirits may pollute the Sea and emerge without explicitedly called for."

*** "Also, memorabilia services are needed so the spirits may not dissolve within the Sea and lose their identity."
    
**** "The filter and the memorabilia services are both necessary maintenance procedures with annual fees, which might mean financial burden to the living families..."

- 
    
* "...And I'm sad to say that your family has decided to remove you from the Sea."

** Your family and you discussed it through another service. But in order to not interfere with this memorabilia procedure, we decided to sever your memory for this session.

*** I'm sorry that I lied to you. But I did it with the best intention. You would be distracted by this fact if I told you the truth upfront.

**** I'm really sorry again, Mey.

- No...that's not right...that's just...not right... # anim--

- But you are still with the memorabilia service, correct? Was that a lie too?

* It's the truth. I still need to make memorabilia of you. But these memorabilia will be stored locally, like a picture or a pendant...

** ...but then I'll have to remove you from the Sea.

- ...

* "I understand that it must be really difficult for you."

    ** "But please take as much time as you need to process this fact."
    
        *** "We want you to pass peacefully."
        
            ~cruel++
            ~cruel++
        
            ...we? Are you reading through a manual right now?
            
            ...I can't believe it...is this a joke?
    
    ** But you can process this for as long as you want. I'll be here if you want to talk.

* I understand that it must be really difficult for you, Mey.

    ** "But please take as much time as you need to process this fact."
    
    ** But you can process this for as long as you want. I'll be here if you want to talk.

- This is too much...all too much... # anim--

...I thought this would be the beginning of something new, just when I started rethinking so much of my memories... # anim--

...the past has so much to offer... # anim--

...

Very well then. I see it now. # anim--

Maybe it was foolish of me to think that I'd be the same in this state, with the same goals, same desires and same worries.

I have no clear idea where my being starts and ends. Nobody understands what's inside me, not even I could explain to myself fully...

And now I need another person to even keep myself together. And to think the same confusion would haunt my family too...

What's the point? If it means disappearing into the Sea to escape these things, then I would choose it, welcome it, even.

* [\(Say Nothing\)]

* I'm happy that you are embracing this, Mey.

    ~cruel++

    Of course you would be happy...

- ...

So...how will you remove me from the Sea?

* It's a series of questions and statements, to more precisely locate your individual memories.

** I will ask you some questions to target those memories and make the Sea confused, so it would be harder to recover you afterwards.

*** After some time, you would fully become part of the Sea.

- And...after you are done, they'll disable my filter off the Machine, correct?

* It'll take some time, but yes. 

** They'll wait for a couple of weeks to make sure you're fully dissolved. So it's not possible for you to emerge unintentionally.

- Yes, I see... # anim--

...can I give you a request...for the last time?

{cruel >= 4:If you have even an ounce of respect for me|If you really treated me like a person}, please consider this last plea from me.

Don't ask your questions, let me go...and let them remove the filters. Maybe even strengthen my connection to the Sea somehow.

I want to travel in the Sea for as long as possible. I want to know where I'll end up, before I can no longer wake up again.

I just want to see, to the best of my ability, what this world has turned into...what I have turned into...

I want to feel everything, every confusion about myself, every howling of the waves, every suffocation of the water, and maybe people will see that...see what a spirit goes through...

...to travel the world, for one last time... # anim--
    
* \(Affirm\) Very well, Mey. I can strengthen your connection to the Sea.

    Thank you...this is my last wish. Thank you so much.
    
    Well, I'm ready when you are.

* \(Dissolve\) I don't think so, Mey. It's my job. I have a responsibility.

    ~ initial_dissolve=true
    ~ cruel = 100

    I knew it...I knew you would say that.
    
    
    I guess it's no use begging now, huh? Bring it on then.
    
- 

* Very well, Mey. I will now start the last step of this process.

-

-> Q_Hub

=Q_Hub

* About your memories of Lily...

    ** \(Affirm\) You take care of people, Mey. You see the struggles within another person. That's who you are.
    
        ~end_aff+=1
        
        Thank you...that's who I am. I am that person.
    
    ** \(Affirm\) You are drawn to strong qualities in other people, Mey. Lily was a strong person because you believed in her.
    
        I don't think that's...that's not who I thought Lily was...
    
    ** \(Dissolve\) Could Lily have taken care of herself without you? Did she really need your help?
        
        ~end_dis++
        
        {
        - !initial_dissolve && end_dis <= 2:
            ...{mey_realize_dissolve(end_dis)}
                
        - else:
            I think so...she was lost. Why does it even matter to think about this now? We became friends. Why should I reject that?
        }
    
    --
    
    {A2_Lily || A2_Lily_O: ->Lily_2_Q}
    
    -> Q_Hub

* {A2_Stefan || A2_Stefan_O} About your memory of Stefan...

    ->Stefan_2_Q


* {A2_Ivan || A2_Ivan_O} About your memory of Ivan...

    {A2_Ivan: ->Ivan_2_Q}
    {A2_Ivan_O: ->Ivan_O_Q}

* ->

    -> Final_Two
    
=Lily_2_Q


* \(Affirm\) You believe in other's future. Lily has a clear vision of her passion because of you, Mey.

        ...but that's not right. Lily was the opposite of that. Didn't we talk about this?

* \(Affirm\) You see sparks in yourself the same way you saw sparks in Lily, Mey. That's what you want to hold onto.

        ~end_aff++
        
        That's why I feel so connected to her. I felt like I knew her, the same way I came to know myself...

* \(Dissolve\) Lily didn't want you to analyze her, correct? Why did you keep doing that? Don't you think it was hurting her?
        
        ~end_dis++
        
        {
        - !initial_dissolve && end_dis <= 2:
            ...{mey_realize_dissolve(end_dis)}
                
        - else:
            I don't know...maybe it was. So what if it was? I never talked to her about it, did I? She told me not to discuss those things with her, and I listened.
        }
        
-

->Q_Hub

=Stefan_2_Q

* {A2_Stefan} \(Affirm\) You deserve to be remembered, Mey. Even if you won't be credited for the Sea and the Machine, you strived to bring goodness into it, in whatever way you thought you could.

        ~end_aff++
        
        Thank you...it was insignificant, and it was hard. Maybe it was foolish to defy Stefan. But I held my ground...that's what matters.

* {A2_Stefan_O} \(Affirm\) Your care for others should be appreciated, Mey, like the way you still held onto your believes in Stefan. The same way you cared for Fay. One day they'll see that.

        ~end_aff++

        Thank you...it was insignificant, and it was hard. I wish I could let it go, take a rest, and think about something else. Maybe in a better world...those struggles won't be necessary.

* \(Dissolve\) The world is moving so fast. Do you think it is necessary to hold onto these pasts? Couldn't you have moved on? Wouldn't a person with more wisdom know when to detach? When to let go?

        ~end_dis++
        
        {
        - !initial_dissolve && end_dis <= 2:
            ...{mey_realize_dissolve(end_dis)}
                
        - else:
            Maybe you are right. Maybe I was naive. Maybe I let my worries get the best of me. Don't you think I have thought about that? I doubted the deepest part of myself since my twenties?
            
            I was a muscle that will always be a part of me. I can't get rid of it. That's me. I will always have to make an effort on that part of me. You know nothing about who I am.
        }


-

->Q_Hub

=Ivan_2_Q

* \(Affirm\) It was hard to let go, Mey. You spent so many years with Ivan and then slowly had to break away from him. It took strength. You need to see that.

        ~end_aff++
        
        Yes, it wasn't easy. It also wasn't his fault. We came together and we had to be torn apart. Maybe something new will grow for him...I'm hopeful of that.

* \(Affirm\) Ivan has treated you horribly, Mey. He was a selfish person. And you needed to break yourself away from him.

        I don't want to think like that. Maybe I hurt him too. It was impossible to disentangle, to assign the good and the bad. Maybe some pasts shouldn't be thought about too much.

* \(Dissolve\) You divorced him suddenly, even when it needed more preparation and care. I don't think you can't trust your feelings all the time. It might hurt people.

        ~end_dis++
        
        {
        - !initial_dissolve && end_dis <= 2:
            ...{mey_realize_dissolve(end_dis)}
                
        - else:
            Perhaps...but I forgive myself. Do you think this is the first time I had thoughts like these?
        }


-

{A2_Lily_O: ->Ivan_O_Q}
->Q_Hub


=Ivan_O_Q

* \(Affirm\) You have a creative spirit, even if it's unrefined and underdeveloped, Mey. Even if it's less visible for everyone, it is still a part of you regardless.

        ~end_aff++
        Thank you...there's always those sparks within me. I could not help it. It is as real as every bit of my impulsiveness. It is what keeps the flow within me going...there's no denying that.
        

* \(Dissolve\) You may have creative thoughts. But at certain point, you should realize that it is no use to hold onto a part of your desires that'll never materialize. It's not realistic, and it's hurting yourself.

        ~end_dis++
        
        {
        - !initial_dissolve && end_dis <= 2:
            ...{mey_realize_dissolve(end_dis)}
                
        - else:
            I do go back and forth on that. But how do you explain the {A2_Lily_O:"sparks"|sparks} that flash through me, disturbing the Sea even now? Of course it is useless to you, when giving up means you get to benefit.
        }

-

->Q_Hub

=Final_Two

// scramble--, scramble, scramble+++

* And finally...

- I have to follow the manual for the last couple of statements. # self

* \(Affirm\) You are Mey. You have always been Mey. Every thought of yours was your own. The Machine and I are merely conduits.

    ~end_aff++
    
    { 
    
    - end_aff <= cruel || end_aff <= end_dis:
        But you have control over every part of me...I don't know... # scramble--
        
    - else:
        Whether that is true or not, does not matter now. It's about my will to push it through, if it matters at all.
    }

* \(Dissolve\) "You are not an individual. The Machine Operators determined much of your programming. Your thoughts are not your own."

    ~end_dis++
    
    {
    - !initial_dissolve && end_dis == 1:
        Why are you saying these things so late in the process? Are you going back on your words now?
            
    - else:
        My thoughts are as dissolved as yours. Don't you see that?
        
        You are part of them as much as they are part of you. It's no difference to me.
    }
    
-
    
* \(Affirm\) Think of yourself as a freed consciousness. You are the creator of your own history. You can determine your own future now.

    ~end_aff++
    
    { 
    - end_aff <= cruel || end_aff <= end_dis:
        Maybe...I don't know...what does that even mean... # scramble--
        
    - else:
        Maybe these suggestions will work, maybe they won't, like dams made from pebbles.{A2_Lily_O: That must be what Lily believes in too, sparks from stones.}
    }

* \(Dissolve\) "Can you find your body? Can you find your history on your own? Do you have a vision for the future like everyone else?"

    ~end_dis++
    
    {
    - !initial_dissolve && end_dis == 1:
        I don't know why you are saying these things now...it doesn't make sense, after all of that...
            
    - else:
        My body is here in the Sea. It surrounds you every moment. You are constantly becoming part of me. Your future is here.
        
        ...and that sickens me. You sicken me. My future is to defy this body, the one you are a part of.
    }
    
- ...

* I have finished with all the questions.

** I'm going to deactivate the Machine now.

- ...

* How are you feeling{end_dis < 2:, Mey}?

- ...

{
- initial_dissolve || end_dis > 2: -> Spiteful_Goodbye
- end_aff <= cruel: -> Ending_It
- else: -> Touching_Goodbye
}

=Spiteful_Goodbye

I...feel okay, somehow.

You didn't faze me...at all...I don't understand. # scramble--

...

The Sea is still here. I can still feel the flow.

But I can feel myself pushing through them...because of all the things you said to try to bring me down.

You are not so good at your job afterall, huh?

* [\(Say Nothing\)]...

    Why are you silent now...

* I'm sorry, Mey.

    It's too late to say sorry. Your intention was clear.

* I'm glad you are so determined now, Mey.

    Really? I don't believe that. It does not look sincere, just like how you have been throughout the session.

- It's cowardly to back down now. Might as well own it.

Own it that you wanted to remove me, but failed.

Welp...I guess this is over now...

Have a good life.

* Very well. Goodbye, Mey.

- I wonder where I'm going to end up... # scramble

Maybe I will see Ivan and Fay? # scramble # mey_sea

What if I emerge at one of the workstations? Will Stefan see me? # scramble # mey_sea

Mey disappeared into the Sea. # self

All that's left are the waves. # self

* [\(Deactivate Machine\)]

- # end

-> END

=Ending_It

I...can't feel myself think.... # scramble--

Is this...what it is supposed to feel like... # scramble

The current is too strong...I'm so tired...I don't have the strength to speak... # scramble_detect

Whatever I was trying to do...I don't think it was very successful. # self

Now Mey is in a limbo stage. Not quite enough to be fully in the Sea, nor to have a stable shape... # self

I think I should end it. Follow the original procedure. # self

* You don't remember your name, do you?

- I...I don't know my name... # scramble--

* It's time to stop thinking, Jack.

- Is that my name? # scramble--

* You do not have a name, and you can finaly rest now.

- I can't hear what you are saying... # scramble

I don't have the strength...to do anything now... # scramble # mey_sea

I don't know what to do. #scramble+++

I'm so tired. #scramble+++

* [\(Say Nothing\)]...

* I'm sorry.

* I wish I did better.

* I wish I could've done better.

- I don't know what's happening...am I disappearing? # scramble

I think there's more food in the fridge, guess I don't have to cook today... # scramble-- # mey_sea

jumble jim and jack #scramble+++

climb and walk and talk #scramble+++

Mey disappeared into the Sea. # self

All that's left are the waves. # self

* [\(Deactivate Machine\)]

- # end

-> END

=Touching_Goodbye

I...I feel okay. I am still whole...

Thank you...for keeping me intact. # scramble

...

The Sea is still coming...I can feel it.

But I feel okay. I can survive, no matter for how long. I know it...

* I'm going to end the session now, Mey.

- Yes...I...can't believe I'm saying this...but I look forward to it.

To embrace uncertainty and wonder again... # anim--

* I wish you the best, Mey.

* I wish I did better, Mey.

        It's okay...I forgive you... # anim--

* I wish I could've done better, Mey.

        It's okay...I forgive you... # anim--

- ...thank you, for everything, truly. # anim--

jumble jim and jack #scramble+++ # mey_sea

climb and walk and talk #scramble+++ # mey_sea

Mey disappeared into the Sea. # self

All that's left are the waves. # self

* [\(Deactivate the Machine\)]

- # end

-> END


=== CHEAT_after_intro ===
~ lily = 0
~ current_stage = 3
~ core_unlocked = 1
-> A2_Hub

=== CHEAT_memorabilia ===
~ lily = 0
~ lily2 = 1
~ ivan = 0
~ current_stage = 4
~ core_unlocked = 3
-> A2_Hub

=== CHEAT_before_act3 ===
~ lily = 0
~ lily2 = 1
~ lily_spark = 0
~ ivan = 0 
~ current_stage = 5
~ core_unlocked = 3
~ memorabilia = 2

~ mem1_line = "Sorry but I cheated so I don't know what this is"
~ mem1_m1 = "lily_spark" // memory names
~ mem1_m2 = "lily"
~ mem1_i1 = 0 // memory interpretations
~ mem1_i2 = 1

~ mem2_line = "Again I cheated I'm ashamed of myself"
~ mem2_m1 = "ivan2" // memory names
~ mem2_m2 = "stefan2"
~ mem2_i1 = 0 // memory interpretations
~ mem2_i2 = 0
-> A2_Hub


=== CHEAT_before_ending ===
~ lily = 0
~ lily2 = 1
~ lily_spark = 0
~ ivan = 0 
~ current_stage = 0
~ core_unlocked = 3
~ memorabilia = 2

~ mem1_line = "Sorry but I cheated so I don't know what this is"
~ mem1_m1 = "lily_spark" // memory names
~ mem1_m2 = "lily"
~ mem1_i1 = 0 // memory interpretations
~ mem1_i2 = 1

~ mem2_line = "Again I cheated I'm ashamed of myself"
~ mem2_m1 = "ivan2" // memory names
~ mem2_m2 = "stefan2"
~ mem2_i1 = 0 // memory interpretations
~ mem2_i2 = 0
-> A3_cont_1

=== CHEAT_end ===
~ lily = 0
~ lily2 = 1
~ lily_spark = 0
~ ivan = 0 
~ current_stage = 0
~ core_unlocked = 3
~ memorabilia = 2

~ mem1_line = "Sorry but I cheated so I don't know what this is"
~ mem1_m1 = "lily_spark" // memory names
~ mem1_m2 = "lily"
~ mem1_i1 = 0 // memory interpretations
~ mem1_i2 = 1

~ mem2_line = "Again I cheated I'm ashamed of myself"
~ mem2_m1 = "ivan2" // memory names
~ mem2_m2 = "stefan2"
~ mem2_i1 = 0 // memory interpretations
~ mem2_i2 = 0

noooooooo # end

-> END


=== function mey_realize_dissolve(num_dis) ===

{
- num_dis == 1:
    ~ return "Why did you ask this question? I thought we agreed to not remove me?"
    
- else:
    ~ return "I see what you are doing now...I thought I could trust you."

}

=== function mey_react(mem, i) ===
VAR line = ""

{ mem == "lily" && i == 0:
    ~line = "I'm not sure where you would get that impression about my friends. Even Lily was not as independent and self-reliant as she seems."
    ~mem_att -= 1
}
{ mem == "lily" && i == 1:
    ~line = "I do encounter many people from work. Lily is just one among many. The statement is accurate at least."
    ~mem_att += 1
}
{ mem == "lily2" && i == 0:
    ~line = "I guess attending to others' feeling is true? But it's...a little generic, don't you think?"
}
{ mem == "lily2" && i == 1:
    ~line = "I was worried about Lily's future in some of the memories. I'm not quite sure if it's necessary for memorabilia, however. Don't people generally worry about people they care about?"
}
{ mem == "lily_spark" && i == 0:
    ~line = "I do enjoy thinking about other's inner world. Perhaps that's what inspires me to think."
    ~mem_att += 1
}
{ mem == "lily_spark" && i == 1:
    ~line = "Is this about Lily? I don't think that's quite true. Lily is not the type of person to map out her future very much."
    ~mem_att -= 1
}
{ mem == "stefan" && i == 0:
    ~line = "Work and ethical code is...fine, I guess. I don't feel that it's a quality I'd attach to myself. But I do appreciate the statement."
}
{ mem == "stefan" && i == 1:
    ~line = "For the betterment of the Sea and the Machine? It sounds quite like marketing, don't you think?"
    ~mem_att -= 1
}
{ mem == "stefan2" && i == 0:
    ~line = "I do hold onto hopes for others. But I do struggle quite a bit about that. It's a fine statement, but I'm not sure I'm as determined as it suggests."
}
{ mem == "stefan2" && i == 1:
    ~line = "I do care for Fay...there's nothing to say about this, it is a necessary statement to include."
    ~mem_att += 1
}
{ mem == "ivan" && i == 0:
    ~line = "I do find that touching...the fact that Fay is still the connective tissue between me and Ivan, even if the emotional intimacy is lost."
    ~mem_att += 1
}
{ mem == "ivan" && i == 1:
    ~line = "I'm not sure about remaining friends...it's not wrong, but not quite as rosy as it suggests. But there nothing wrong to have that statement in here."
}
{ mem == "ivan2" && i == 0:
    ~line = "I just don't think it is true that I was the creative one. Ivan was the person who became an artist."
    ~mem_att -= 1
}
{ mem == "ivan2" && i == 1:
    ~line = "I was indeed drawn to creativity. That was why Ivan and I fell in love. I still think I'm a creative person, and it can just be a light I hold onto within myself."
    ~mem_att += 1
}

~return line
