from agents import GuardAgent, ClassificationAgent, DetailsAgent, RecommendationAgent, OrderTakingAgent
from huggingface_hub import InferenceClient
import os
import pathlib
folder_path = pathlib.Path(__file__).parent.resolve()

class AgentController():
    def __init__(self):
        self.client = InferenceClient(
            model=os.getenv("MODEL_NAME"),     
            token=os.getenv("HF_API_TOKEN")
        )
        self.embedding_client = InferenceClient(
            model=os.getenv("EMBEDDING_MODEL_NAME"),
            token = os.getenv("HF_API_TOKEN")
        )
        self.guard_agent = GuardAgent(self.client)
        self.classification_agent = ClassificationAgent(self.client)
        self.recommendation_agent = RecommendationAgent(
            self.client,
            os.path.join(folder_path, 'recommendation_objects/apriori_recommendations.json'),
            os.path.join(folder_path, 'recommendation_objects/popularity_recommendation.csv')
        )
        self.agent_dict = {
            'details_agent': DetailsAgent(self.client, self.embedding_client),
            'recommendation_agent': self.recommendation_agent,
            'order_taking_agent': OrderTakingAgent(self.client, self.recommendation_agent)
        }

    def get_response(self, input):
        job_input = input['input']
        messages = job_input['messages']

        guard_agent_response = self.guard_agent.get_response(messages)
        if guard_agent_response['memory']['guard_decision'] == 'not allowed':
            return guard_agent_response

        classification_agent_response = self.classification_agent.get_response(messages)
        chosen_agent = classification_agent_response['memory']['classification_decision']

        agent = self.agent_dict[chosen_agent]
        response = agent.get_response(messages)

        return response