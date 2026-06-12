import numpy as np
from tomlkit import item

def get_chatbot_response(client, messages, temp=0.0):
    
    response = client.chat.completions.create(
         messages=messages,
        temperature=temp,
        top_p=0.8,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

def get_embedding(embedding_client, text_input):
    embedding = embedding_client.feature_extraction(text_input)
    embedding = np.array(embedding)
    if len(embedding.shape) == 2:
        embedding = np.mean(embedding, axis=0)
    
    return embedding.tolist()


def double_check_json_output(client, json_string):
    prompt = f"""
    You will check this json string and correct any mistakes that will make it invalid. Then you will return the correct json string. Nothing else.
    If the Json is correct just return it. 

    If there is any text before or after the json string, remove it. 
    Do NOT return a single letter outside of the json string.
    Make sure that each key is enclosed in double quotes. 
    The first thing you write should be the opening curly brace of the json and the last character should be the closing curly brace.

    You should check the json string for the following text between triple backticks:
    ```
    {json_string}
    ```
    """

    messages = [{"role": "user", "content": prompt}]
    
    response = get_chatbot_response(client, messages)
    
    response = response.replace('`', '')

    return response


class ValidOrderChecker():

    MENU_DATA = {
        "Cappuccino": {
            "small": {"price": 3.75, "calories": 80},
            "medium": {"price": 4.50, "calories": 110},
            "large": {"price": 5.25, "calories": 150}
        },
        "Latte": {
            "small": {"price": 4.25, "calories": 120},
            "medium": {"price": 4.75, "calories": 180},
            "large": {"price": 5.50, "calories": 240}
        },
        "Dark chocolate (Drinking Chocolate)": {
            "small": {"price": 4.50, "calories": 220},
            "medium": {"price": 5.00, "calories": 300},
            "large": {"price": 5.75, "calories": 380}
        },
        
        "Espresso shot": {None: {"price": 2.00, "calories": 3}},
        "Dark chocolate (Packaged Chocolate)": {None: {"price": 4.00, "calories": 150}},
        "Jumbo Savory Scone": {None: {"price": 3.25, "calories": 400}},
        "Chocolate Chip Biscotti": {None: {"price": 2.50, "calories": 125}},
        "Cranberry Scone": {None: {"price": 3.50, "calories": 400}},
        "Hazelnut Biscotti": {None: {"price": 2.75, "calories": 125}},
        "Chocolate Croissant": {None: {"price": 3.75, "calories": 350}},
        "Almond Croissant": {None: {"price": 4.00, "calories": 350}},
        "Ginger Biscotti": {None: {"price": 2.50, "calories": 115}},
        "Oatmeal Scone": {None: {"price": 3.25, "calories": 400}},
        "Croissant": {None: {"price": 3.25, "calories": 265}},
        "Ginger Scone": {None: {"price": 3.50, "calories": 400}},
    }

    SYRUP_FEE = 1.50

    def __init__(self):
        self.order = None
        self.major_issues = None

    def validate_order(self, order, user_message = None):
        self.order = order
        valid_order = []
        self.major_issues = {}
        for item in self.order:
            num_invalid_items = len(self.major_issues)
            self.validate_item_names(item, user_message)
            if num_invalid_items == len(self.major_issues):
                self.validate_item_quantity(item)
                if num_invalid_items == len(self.major_issues):
                    self.validate_item_syrups_or_size(item, 'size')
                    self.validate_item_syrups_or_size(item, 'syrups')
                if num_invalid_items == (len(self.major_issues)):
                    self.update_item_totals(item)
                    valid_order.append(item)
        
        if len(valid_order) > 1:
            valid_order = self.combine_duplicate_items(valid_order)

        response = self.create_response(valid_order)

        return {
            "valid_order": valid_order,
            "major_issues": self.major_issues,
            "response": response
        }
    
    def validate_item_names(self, item, user_message = None): 
        valid_item_names = [
        'Espresso shot',
        'Dark chocolate (Drinking Chocolate)',
        'Dark chocolate (Packaged Chocolate)',
        'Cappuccino',
        'Latte',
        'Jumbo Savory Scone',
        'Oatmeal Scone',
        'Chocolate Chip Biscotti',
        'Cranberry Scone',
        'Hazelnut Biscotti',
        'Croissant',
        'Chocolate Croissant',
        'Almond Croissant',
        'Ginger Biscotti',
        'Ginger Scone'
    ]
        
        item['item'] = item['item'].strip()
        if item['item'] not in valid_item_names:
            self.add_item_to_issues(item, 'Item not on menu.')

            if 'dark chocolate' in (user_message or '').lower():
                explicit_drinking = '(drinking chocolate)' in user_message.lower()
                explicit_packaged = '(packaged chocolate)' in user_message.lower()
                if not explicit_drinking and not explicit_packaged:
                    self.add_item_to_issues(item,'Please specify if you want "Dark chocolate (Drinking Chocolate)" or "Dark chocolate (Packaged Chocolate)"')

    def validate_item_quantity(self, item):
        if not isinstance(item['quantity'], int) or item['quantity'] <= 0:
            self.add_item_to_issues(item, 'Invalid quantity. Quantity must be a positive integer.')

    def validate_item_syrups_or_size(self, item, syrups_or_size):
        item_names_with_sizes_and_syrups = ['Cappuccino', 'Latte', 'Dark chocolate (Drinking Chocolate)']
        syrup_or_size_dict = {
            'syrups': self.validate_item_syrup_names,
            'size': self.validate_item_size_name
        }
    
        if item['item'] in item_names_with_sizes_and_syrups:
            syrup_or_size_dict[syrups_or_size](item)
        
        else:
            if syrups_or_size == 'syrups' and item[syrups_or_size] != [] or syrups_or_size == 'size' and item[syrups_or_size] is not None:
                item[syrups_or_size] = [] if syrups_or_size == 'syrups' else None

    def validate_item_syrup_names(self, item):
        SYRUP_NORMALIZATION = {
            "Caramel": "Carmel",
            "caramel": "Carmel",
            "carmel": "Carmel"
        }
        valid_syrup_names = ['Chocolate', 'Hazelnut', 'Carmel', 'Sugar Free Vanilla']
        normalized_syrups = []

        for syrup in item.get('syrups', []):
            syrup = SYRUP_NORMALIZATION.get(syrup, syrup)
            normalized_syrups.append(syrup)

            if syrup not in valid_syrup_names:
                self.add_item_to_issues(item, f'Invalid syrup name: {syrup}.')

        item['syrups'] = normalized_syrups
        
    def validate_item_size_name(self, item):
        valid_size_names = ['small', 'medium', 'large']
        if item['size'] not in valid_size_names:
            self.add_item_to_issues(item, 'Invalid size, give a proper size (small, medium, or large) to the item.')

    def create_response(self, valid_order):
        if not self.major_issues:
            return ''

        lines = ["There were some issues with the order."]
        if self.major_issues:
            lines.append("")
            lines.append("Major Issues (you need to fix):")
            for key, val in self.major_issues.items():
                lines.append(f"- {key}: {val}")
        if valid_order:
            lines.append("")
            lines.append("Current Order:")
            for item in valid_order:
                lines.append(f"- {item['quantity']} {self.create_full_item_name(item)}")

        return "\n".join(lines)

    def add_item_to_issues(self, item, reason):
        invalid_item_name = self.create_full_item_name(item)
        self.major_issues[invalid_item_name] = (self.major_issues.get(invalid_item_name, '') + ' ' + reason).strip()

    def convert_valid_order_to_string(self, order):
        if len(order) == 0:
            return '\n\nThere is no current order.'

        order_as_str = '\n\nCurrent Order: '

        for item in order:
            item_as_str = self.create_full_item_name(item)
            order_as_str += f"{item['quantity']} {item_as_str}, "
        
        order_as_str = order_as_str.strip()[:-1] + '.'
        
        return order_as_str
    
    def combine_duplicate_items(self, valid_order):
        updated_valid_order = []
        for item in valid_order:
            duplicate_item = self.check_for_duplicate_items(item, updated_valid_order)
            if duplicate_item:
                duplicate_item['quantity'] += item['quantity']
                continue
            updated_valid_order.append(item)

        return updated_valid_order
    
    def update_item_totals(self, item):
        name = item['item']
        size = item['size'] 
        quantity = item['quantity']
        
        if name in self.MENU_DATA:
            data = self.MENU_DATA[name].get(size)
            if data:
                base_price = data['price']
                base_calories = data['calories']
                
                syrup_total = self.SYRUP_FEE if item.get('syrups') else 0
                
                item['price'] = (base_price + syrup_total) * quantity
                item['calories'] = base_calories * quantity
            
    @staticmethod
    def check_for_duplicate_items(item, updated_valid_order):
        for existing_item in updated_valid_order:
            if (item['item'] == existing_item['item'] and
                item['size'] == existing_item['size'] and
                set(item['syrups']) == set(existing_item['syrups'])):
                
                return existing_item
        
        return None
    
    @staticmethod
    def create_full_item_name(item):
        full_item_name = ''
        full_item_name = ''
        if item['size'] is not None:
            full_item_name += item['size'] + ' '
        full_item_name += item['item'].strip()
        if item['syrups']:
            full_item_name += f" with {', '.join(item['syrups'])}"

        return full_item_name.strip()
    
    @staticmethod
    def check_if_val_in_list(val, given_list):
        for curr_val in given_list:
            if curr_val == val:
                return True
        
        return False

