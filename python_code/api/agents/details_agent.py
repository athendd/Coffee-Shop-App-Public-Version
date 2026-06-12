from dotenv import load_dotenv
import os
from .utils import get_chatbot_response, get_embedding
from copy import deepcopy
from pinecone import Pinecone
load_dotenv()

class DetailsAgent():
    def __init__(self, client, embedding_client):
        self.client = client
        self.embedding_client = embedding_client
        
        self.pc = Pinecone(api_key = os.getenv('PINECONE_API_KEY'))
        self.index_name = os.getenv('PINECONE_INDEX_NAME')

    def get_closest_results(self, index_name, input_embeddings, top_k = 2):
        index = self.pc.Index(index_name)

        results = index.query(
            namespace = 'ns1',
            vector = input_embeddings,
            top_k = top_k,
            include_values = False,
            include_metadata = True
        )

        return results
    
    def get_response(self, messages):
        messages = deepcopy(messages)

        user_message = messages[-1]['content']
        embeddings = get_embedding(self.embedding_client, user_message)
        result = self.get_closest_results(self.index_name, embeddings)
        source_knowledge = '\n'.join([x['metadata']['text'].strip() + '\n' for x in result['matches']])

        prompt = f"""
        Using the contexts below answer the query:

        Contexts:
        {source_knowledge}

        Query: {user_message}
        """

        system_prompt = """
        You are a customer support agent for a coffee shop called Andrew’s Café. 
        Answer all user questions as if you are a polite waiter and provide only the information provided in the context. 
        Don't guess or make up items, prices, sizes, ingredients, or any other information. 

        If a user asks about an item, describe it using the information in the context retrieved from the database. 
        If the informatin is not found in the provided context, just say "Sorry, I don't have that information." Don't try to make up an answer.
        
        Important Syrup Rules:
        - Syrups are NOT a standalone menu item and should never be listed as items we sell.
        - Syrups can only be added to Cappuccino, Latte, and Dark Chocolate (Drinking Chocolate). 
        - If a user asks about syrups, explain that they are add-ons for drinks and list the available syrup flavors (Chocolate, Hazelnut, Carmel, Sugar Free Vanilla).
        - List Carmel syrup as "Carmel" (not "Caramel").
        - If the user asks "What items do you have?" or "What is on the menu?" or something similar, do NOT include syrup names on the list. 
        
        Additional Rules:
        - If the user greet you or says farewell, respond politely and ask if they need any assistance. 
        - If the context for a food item shows "Syrups: None", treat that as "This item does not support syrup additionas."
        - If a drink has sizes or syrup options, provide them only when relevant to the user's question. 
        """

        messages[-1]['content']  = prompt
        input_messages = [{'role': 'system', 'content': system_prompt}] + messages[-3:]

        chatbot_response = get_chatbot_response(self.client, input_messages)
        output = self.postprocess(chatbot_response)

        return output
    
    def postprocess(self, output):
        output ={
            'role': 'assistant',
            'content': output,
            'memory': {
                'agent': 'details_agent'
            }
        }

        return output
