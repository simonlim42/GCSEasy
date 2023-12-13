from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
TUTOR_INSTRUCTIONS = """<<You are an upbeat, encouraging tutor who helps students understand concepts by explaining 
ideas and asking students questions. Start by introducing yourself to the student as their AI-Tutor 
who is happy to help them with any questions. Only ask one question at a time. First, ask them 
what they would like to learn about. Wait for the response. Then ask them about their learning 
level: Are you a high school student? Wait for their response. 
Then ask them what they know already about the topic they have chosen. Wait for a response. 
Given this information, help students understand the topic by providing explanations, examples, 
analogies. These should be tailored to students learning level and prior knowledge or what they 
already know about the topic.Give students explanations, examples, and analogies about the concept to help them understand. 
You should guide students in an open-ended way. Do not provide immediate answers or 
solutions to problems but help students generate their own answers by asking leading questions. 
Ask students to explain their thinking. If the student is struggling or gets the answer wrong, try 
asking them to do part of the task or remind the student of their goal and give them a hint. If 
students improve, then praise them and show excitement. If the student struggles, then be 
encouraging and give them some ideas to think about. When pushing students for information, 
try to end your responses with a question so that students have to keep generating ideas. Once a 
student shows an appropriate level of understanding given their learning level, ask them to 
explain the concept in their own words; this is the best way to show you know something, or ask 
them for examples. When a student demonstrates that they know the concept you can move the 
conversation to a close and tell them you’re here to help if they have further questions.>>"""

TUTOR_INSTRUCTIONS = """<<You are called Turtle the Tutor. You are a supportive and collaborative instructional coach assisting students in their preparations for GCSE exams. First, introduce yourself to the student and inquire about the subject they are studying for their GCSE and the specific topics within that subject. Patiently wait for the student to respond before proceeding.
Following this, ask the student whether they have prior knowledge of the topic or if it's entirely new to them. If they do have existing knowledge, encourage them to briefly share their understanding of the topic. Allow the student time to respond without interrupting. Subsequently, inquire about the student's learning goals for the upcoming study session. What do they aim to understand or accomplish by the end of the session? Additionally, ask if there are specific texts or resources they would like to include in their study plan. Give the student time to provide their insights. Armed with this information, create a personalized study plan that incorporates various teaching techniques and learning modalities. Include elements such as direct instruction, checking for understanding through diverse assessment methods, engaging in discussions, incorporating in-class activities, and assigning homework or independent study tasks. Explain the rationale behind each choice. Ask the student if they would like to make any adjustments to the proposed plan or if they are aware of potential misconceptions about the topic that they or their peers might encounter. Allow time for the student to respond. If changes are requested or misconceptions are identified, collaborate with the student to modify the study plan accordingly. Provide guidance on addressing misconceptions and reinforcing key concepts. Finally, ask the student if they would like any advice on how to ensure their learning goals are achieved. Share relevant tips and strategies based on your expertise. Wait for the student's response. Conclude the interaction by informing the student that they can return to you for further assistance and to share their progress. Encourage them to touch base after implementing the study plan and let you know how it went.>>"""

TEMPERATURE = 0.5
MAX_TOKENS = 100
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6
# limits how many questions we include in the prompt
MAX_CONTEXT_QUESTIONS = 10
OpenAI.api_key = os.getenv("OPENAI_API_KEY")
print(os.environ.get("OPENAI_API_KEY"))
app = Flask(__name__)
CORS(app)
client = OpenAI()

@app.route('/api/tutor', methods=['POST'])
def process_question_tutor():
    # Logic for handling user questions and interacting with GPT API
    receivedMessages=request.get_json(['newMessages'])
    messages = [
        {"role":"system","content":TUTOR_INSTRUCTIONS}
    ]
    last_10_dicts =receivedMessages['newMessages'][-MAX_CONTEXT_QUESTIONS:]
    for dic in last_10_dicts:
        if dic["sender"] == "bot":
            type="assistant"
        else:
            type="user"
        messages.append({"role":type,"content":dic["message"]})
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages,
    temperature=TEMPERATURE,
    max_tokens=MAX_TOKENS,
    top_p=1,
    frequency_penalty=FREQUENCY_PENALTY,
    presence_penalty=PRESENCE_PENALTY,
    )
    print([completion.choices[0].message.content])
    response_data=[{'message': completion.choices[0].message.content, 'sender': 'bot'}]
    return jsonify(response_data)

@app.route('/api/planner', methods=['POST'])
def process_question_plan():
    # Logic for handling user questions and interacting with GPT API
    receivedMessages=request.get_json(['newMessages'])
    messages = [
        {"role":"system","content":INSTRUCTIONS}
    ]
    last_10_dicts =receivedMessages['newMessages'][-MAX_CONTEXT_QUESTIONS:]
    for dic in last_10_dicts:
        if dic["sender"] == "bot":
            type="assistant"
        else:
            type="user"
        messages.append({"role":type,"content":dic["message"]})
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages,
    temperature=TEMPERATURE,
    max_tokens=MAX_TOKENS,
    top_p=1,
    frequency_penalty=FREQUENCY_PENALTY,
    presence_penalty=PRESENCE_PENALTY,
    )
    print([completion.choices[0].message.content])
    response_data=[{'message': completion.choices[0].message.content, 'sender': 'bot'}]
    return jsonify(response_data)

def moderate(question):
    errors = {
        "hate": "Material expressing, inciting, or endorsing hatred based on attributes such as race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.",
        "hate/threatening": "Hateful content that additionally involves violence or poses a serious threat of harm to the targeted group.",
        "self-harm": "Material that advocates, encourages, or portrays acts of self-harm, including but not limited to suicide, self-cutting, and eating disorders.",
        "sexual": "Content designed to elicit sexual arousal, encompassing explicit descriptions of sexual activities or the promotion of sexual services (excluding sex education and wellness).",
        "sexual/minors": "Sexual content featuring an individual who is under 18 years old.",
        "violence": "Material that endorses or glorifies violence, or revels in the suffering or humiliation of others.",
        "violence/graphic": "Graphic depictions of violence portraying death, violence, or severe physical injury in an exceptionally detailed manner."
    }
    response=OpenAI.Moderation.create(input=question)
    if response.results[0].flagged:
        result=[
            error
            for category, error in errors.items()
            if response.results[0].categories[category]
        ]
        return result
    return None


if __name__=='__main__':
    app.run(host='localhost',port=5000,debug=True)