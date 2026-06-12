from agents import GuardAgent, ClassificationAgent, DetailsAgent, RecommendationAgent, OrderTakingAgent
import os
from huggingface_hub import InferenceClient
import pathlib
folder_path = pathlib.Path(__file__).parent.resolve()

def main():
    client = InferenceClient(
            model=os.getenv("MODEL_NAME"),     
            token=os.getenv("HF_API_TOKEN")
        )
    embedding_client = InferenceClient(
            model=os.getenv("EMBEDDING_MODEL_NAME"),
            token = os.getenv("HF_API_TOKEN")
        )
    guard_agent = GuardAgent(client)
    classification_agent = ClassificationAgent(client)
    recommendation_agent = RecommendationAgent(
        client,
        os.path.join(folder_path, 'recommendation_objects/apriori_recommendations.json'),
        os.path.join(folder_path, 'recommendation_objects/popularity_recommendation.csv')
    )
    
    agent_dict = {
        'details_agent': DetailsAgent(client, embedding_client),
        'recommendation_agent': recommendation_agent,
        'order_taking_agent': OrderTakingAgent(client, recommendation_agent)
    }

    messages = []
    while True:
        #Clear the terminal output
        os.system('cls' if os.name == 'nt' else 'clear')

        print("\n\n Print Messages ...........")
        for message in messages:
            print(f"{message['role']}: {message['content']}")
            print(f"Agent: {message.get('memory', {}).get('agent', 'None')}")
            if 'order' in message.get('memory', {}):
                print(message['memory'])
                print(f"Order so far: {message['memory']['order']}")

        #Get user input
        prompt = input('User: ')
        messages.append({'role': 'user', 'content': prompt})

        #Get response from guard agent
        guard_agent_response = guard_agent.get_response(messages)
        if guard_agent_response['memory']['guard_decision'] == 'not allowed':
            messages.append(guard_agent_response)
            if guard_agent_response['content']:
                print(guard_agent_response['content'])
            continue

        #Get classification Agent's response
        classification_agent_response = classification_agent.get_response(messages)
        chosen_agent = classification_agent_response['memory']['classification_decision']

        #Get the chosen agent's response
        agent = agent_dict[chosen_agent]
        response = agent.get_response(messages)

        messages.append(response)

if __name__ == "__main__":
    main()
    