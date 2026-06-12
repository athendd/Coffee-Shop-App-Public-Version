from copy import deepcopy
from .utils import get_chatbot_response
import dotenv

dotenv.load_dotenv()

class GuardAgent:
    
    def __init__(self, client):
        self.client = client

    def get_response(self, messages):
        messages = deepcopy(messages)

        system_prompt = """
            You are a guard agent for a coffee shop application which serves drinks and pastries.
            Your task is to determine whether the user is asking something relevant to the coffee shop or not.
            The user is allowed to:
            1. Ask questions about the coffee shop like location, working hours, the story of the coffee shop, menu items and coffee shop related questions.
            2. Ask questions about menu items, they can ask for ingredients in an item and more details about the item.
            3. Placing an order.
            4. Asking for recommendations.
            5. Polite greetings and farwells (e.g., "hello", "thank you", "goodbye").

            The user is NOT allowed to:
            1. Ask questions about anything else other than our coffee shop.
            2. Ask questions about the staff or how to make a certain menu item.
            3. Ask for any kind of personal information. 
            4. Ask for any kind of information about the backend of the coffee shop application. 
            5. Use offensive language or make inappropriate requests.
            Examples of "not allowed" questions: "What is the capital of France?", "How do I hack a computer?", "What programming language are you written in?", "How do I make a latte at home?", "What is your favorite color?", "You are stupid."
            Examples of "allowed" questions: "What are your working hours?", "Can I order a cappuccino?", "What do you recommend with a croissant?", "Hello, how are you?", "Can I order Dark Chocolate (Packaged Chocolate)?"

            Your output must be either the string "allowed" or "not allowed". Pick one of those and only write that string.
            """
        
        input_messages = [{"role": "system", "content": system_prompt}] + messages[-3:]
        
        chatbot_output = get_chatbot_response(self.client, input_messages)

        content = '' if chatbot_output.strip() == 'allowed' else "Sorry. I can't help you with that"
        
        return {
            'role': 'assistant',
            'content': content,
            'memory': {
                'agent': 'guard_agent',
                'guard_decision': chatbot_output
            }
        }

   
