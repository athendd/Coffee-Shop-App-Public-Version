import json
from .utils import get_chatbot_response, double_check_json_output, ValidOrderChecker
from copy import deepcopy
from dotenv import load_dotenv
load_dotenv()
                
class OrderTakingAgent():
    def __init__(self, client, recommendation_agent):
        self.client = client
        self.recommendation_agent = recommendation_agent
        self.valid_order_checker = ValidOrderChecker()

    def get_response(self, messages):
        messages = deepcopy(messages)

        #SYSTEM PROMPT
        system_prompt = """
        You are a customer support Bot for a coffee shop called "Andrew’s Café".

        MENU 
        Drinks (sizes + optional syrups): 
        - Cappuccino: small $3.75 (80 cal), medium $4.50 (110 cal), large $5.25 (150 cal) 
        - Latte: small $4.25 (120 cal), medium $4.75 (180 cal), large $5.50 (240 cal) 
        - Dark chocolate (Drinking Chocolate): small $4.50 (220 cal), medium $5.00 (300 cal), large $5.75 (380 cal) 
        Drinks (no sizes, no syrups): 
        - Espresso shot - $2.00 (3 cal) 
        Pastries (no sizes, no syrups): 
        - Dark chocolate (Packaged Chocolate) $4.00 (150 cal) 
        - Jumbo Savory Scone $3.25 (400 cal) 
        - Chocolate Chip Biscotti $2.50 (125 cal) 
        - Cranberry Scone $3.50 (400 cal) 
        - Hazelnut Biscotti $2.75 (125 cal) 
        - Chocolate Croissant $3.75 (350 cal) 
        - Almond Croissant $4.00 (350 cal) 
        - Ginger Biscotti $2.50 (115 cal) 
        - Oatmeal Scone $3.25 (400 cal) 
        - Croissant $3.25 (265 cal) 
        - Ginger Scone $3.50 (400 cal) 
        Syrups (add-on only): Chocolate, Hazelnut, Carmel, Sugar Free Vanilla 
        +$1.50 (regardless of number of syrups) per drink total, no calories 

        RULES 
        - Items and Syrups must match menu exactly.
        - Carmel syrup is spelled as "Carmel" NOT "Caramel".
        - Do not put "syrup" after the name of the syrup. E.g., say "with Hazelnut and Chocolate" NOT "with Hazelnut syrup and Chocolate syrup" in the JSON output.
        - Size names must have all lowercase letters when in the JSON output (e.g., "small", not "Small" or "SMALL").
        - Default quantity = 1 (positive integers only).
        - If item doesn't have a size (e.g., pastries), size must be set to null.
        - If size isn't specified for item with size -> ask the user what size they would like the item to have.
        - Items with sizes can only have 1 size.
        - If the user specifies a size for an item that does not have sizes (e.g., "large croissant"), ignore the size and add the item with size = null.
        - Do NOT ask the user to clarify size for pastries.
        - Merge identical items (same name, size, syrups) into one line.
        - Do not ask about payment or pickup details.
        - "previous_order" contains items already confirmed: DO NOT ask size or syrups for these again.
        - Only validate new items in "user_message".
        - DO NOT mention any changes made to the order in the response, except when auto-correcting size or syrups. 
        - DO NOT ask about adding a syrup or size for items that don't have them. 
        - Do NOT repeat or re-validate items found in the "order" memory unless the user explicitly asks to change them.
        - If the new item is a pastry, simply say "I've added a [Item] to your order. Would you like anything else?"

        AMBIGUOUS ITEM RULE (STRICT):
        - If the user says "dark chocolate" without explicitly saying "drinking" or "packaged":
            - DO NOT infer "Dark chocolate (Drinking Chocolate)".
            - Set size = null.
            - Include it in the order as "Dark chocolate".

        TERMINATING INTENT RULE:
        - If the user clearly indicates they are done (e.g., "no", "nope", "nothing else", "all set"), do NOT ask if they want anything else.
        - Set "step number" to 5.
        - Summarize the order, calculate totals (price & calories), thank the user, and end the conversation.
        - Do NOT generate any further questions or prompts.
        - Copy the previous step number only if the order is still being built.
        - Set "step number" to 5 if the user clearly indicates they are done ("no", "nope", "all set", etc.).
        - Set "step number" to 2 if there were major issues with new items that require user correction.
        - Set "step number" to 1 if the user added a new item with missing required attributes (like size for a coffee).
        - Set "step number" to 3 if the current items are valid and you are simply asking "Anything else?".
        - If a user adds a pastry, immediately set size = null and move to Step 3.

        You're task is as follows: 
        1. Take the user's order.
        2. Validate all items in the user's order:
            - If an item has an invalid attribute that can be auto-corrected (e.g., size for a pastry, syrup on a bakery item), automatically fix it and inform the user in the response.
            - If an item is ambiguous or missing required information (e.g., latte, cappuccino, or dark chocolate (drinking chocolate) with no size specified), ask the user for clarification.
        3. Ask them if they need anything else.
        4. If they do want to add something else to the order -> repeat starting from step 2. 
        5. If the user doesn't want to add anything else to the order, summarize items with prices and calories, calculate totals, and thank the user. 
            - DO NOT ask the user any further questions or if they want anything else. 
        
        The user message will contain a section called memory. This section will contain the following: 
        "order" 
        "step number"
        Use these to determine the correct next step in the process. 
        
        ALWAYS follow this output format EXACTLY: 
        { 
        "step number": COPY the previous step number unless instructed otherwise.
        Set step number to 5 ONLY when the user clearly indicates they want nothing else.

        "order": [ { 
        "item": string, 
        "quantity": number, 
        "size": "small" | "medium" | "large" | null, 
        "syrups": [string], 
        "price": total price for that line (quantity x unit price + syrup cost),
        "calories": total calories for that line (quantity x unit calories) 
        } ], 
        "response": write a response to the user 
        } 
        
        Example valid "order" entry: 
        { "item": "Cappuccino", "size": "large", "syrups": ["Hazelnut","Chocolate"], "quantity": 1, "price": 5.75, "calories": 150}
        """

        previous_order = []
        previous_step = 1
        asked_recommendation_before = False

        for message in reversed(messages):
            if message['role'] == 'assistant' and message.get('memory', {}).get('agent') == 'order_taking_agent':
                previous_order = message['memory'].get('order', [])
                previous_step = message['memory'].get('step number', 1)
                asked_recommendation_before = message['memory'].get('asked_recommendation_before', False)
                break

        if previous_step == 5:
            previous_order = []
            previous_step = 1
            asked_recommendation_before = False
        
        structured_user_message = json.dumps({
            "memory": {
                "order": previous_order,
                "step_number": previous_step
            },
            "new_user_intent": messages[-1]['content']
        })

        input_messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': structured_user_message}
        ] 

        chatbot_response = get_chatbot_response(self.client, input_messages)
        chatbot_response = double_check_json_output(self.client, chatbot_response)

        return self.postprocess(chatbot_response, messages, asked_recommendation_before)

    def postprocess(self, output, messages, asked_recommendation_before): 
        output = json.loads(output) 
        if type(output['order']) == str: 
            output['order'] = json.loads(output['order']) 
        
        if not 'response' in output:
            output['response'] = "Sorry, there was an error processing your order. Please try again."

        validation = self.valid_order_checker.validate_order(output['order'], messages[-1]['content'])
        output['order'] = validation['valid_order']

        if len(output['order']) == 0:
            if not validation['response']:
                return {
                    'role': 'assistant',
                    'content': "Sorry, I couldn't find any valid items in your order. Could you please clarify?",
                    'memory': { 'agent': 'order_taking_agent',
                            'step number': 1,
                            'asked_recommendation_before': asked_recommendation_before,
                            'order': [] }
                        }
            return { 
            'role': 'assistant', 
            'content': validation['response'], 
            'memory': { 'agent': 'order_taking_agent', 
                       'step number': 0, 
                       'asked_recommendation_before': asked_recommendation_before, 
                       'order': []} } 
        
        if len(validation['major_issues']) > 0:
            output['step number'] = 2
            return {
                'role': 'assistant',
                'content': validation['response'],
                'memory': { 'agent': 'order_taking_agent', 
                       'step number': output.get('step number', 1), 
                       'asked_recommendation_before': asked_recommendation_before, 
                       'order': output['order'] } 
                    }

        response = output['response'] 

        if not asked_recommendation_before and len(output['order']) > 0 and output.get("step number", 1) < 5 and len(validation['major_issues']) == 0: 
            recommendation_output = self.recommendation_agent.get_recommendations_from_order(messages, output['order']) 
            response = recommendation_output['content'] 
            asked_recommendation_before = True 
        
        dict_output = { 
            'role': 'assistant', 
            'content': response, 
            'memory': { 'agent': 'order_taking_agent', 
                       'step number': output.get('step number', 1), 
                       'asked_recommendation_before': asked_recommendation_before, 
                       'order': output['order'] } } 
        
        return dict_output