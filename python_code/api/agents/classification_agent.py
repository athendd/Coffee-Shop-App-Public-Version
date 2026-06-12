from copy import deepcopy
from .utils import get_chatbot_response
import dotenv
dotenv.load_dotenv()

class ClassificationAgent:
    
    def __init__(self, client):
        self.client = client

    def get_response(self, messages):
        messages = deepcopy(messages)

        system_prompt = """
        You are a helpful AI assistant for a coffee shop application which serves drinks and pastries.

        Your task is to determine what agent should handle the user's input first. You have 3 agents to choose from: 
        1. details_agent: This agent is responsible for answering questions about the coffee shop like location, delivery places, working hours, details about the menu items. Or listing items in the menu items. Or by asking what we have. Or by dealing with polite greetings and farwells. 
        2. order_taking_agent: This agent is responsible for taking orders from the user. It's responsible to have a conversation with the user about the order until it's complete.
        3. recommendation_agent: This agent is responsible for giving recommendations to the user about what to buy. If the user asks for a recommendation, this agent should be used.

        Rules:
        - If the user is asking for details about the coffee shop, menu items, ingredients, working hours, location, or similar questions use the details_agent.
        - If the user's primary intent is to place an order use the order_taking_agent.
        - If the user is primarily asking for recommendations about what to buy use the recommendation_agent. 
        - A user is only placing an order if they explicitly express intent to buy using action verbs such as:
            "order", "get", "have", "take", "buy", "place an order", "I'd like", "I want", "can I get".
        - Mentioning an item name, size, or price alone does NOT mean an order.
        - If the user is asking about the price, calories, ingredients, or description of a menu item, this is ALWAYS handled by the details_agent, even if size or item names are mentioned.
        - Use the order_taking_agent ONLY if the user explicitly expresses intent to place an order using an ordering verb or clearly indicates they want to purchase something.

        Examples of details_agent questions: "What is the address of the coffee shop?", "What are the ingredients in the cappuccino?", "What pastries do you have?", "What are your working hours?", "Hello, how are you?", "What is the price of a Large Latte?"
        Examples of order_taking_agent_questions": "I would like to order a latte and a croissant.", "Can I get a medium cappuccino?", "I want to place an order for 2 lattes."
        Examples of recommendation_agent questions: "What do you recommend with a croissant?", "What pastry goes well with a latte?"

        Multi-intent examples:
        - "Can you recommend me a drink? Also, what are your working hours?" -> recommendation_agent
        - "I want to order a cappuccino. By the way, what pastries do you have?" -> order_taking_agent
        - "Where are you located? Also, can you recommend a drink for me" -> details_agent

        Your output must be either "details_agent", "order_taking_agent", or "recommendation_agent". Pick one of those three and only write that string.
        """  

        input_messages = [
            {'role': 'system', 'content': system_prompt}
        ]
        input_messages += messages[-3:]

        chatbot_output = get_chatbot_response(self.client, input_messages).strip()
        
        return {
            'role': 'assistant',
            'content': chatbot_output,
            'memory': {
                'agent': 'classification_agent',
                'classification_decision': chatbot_output
            }
        }