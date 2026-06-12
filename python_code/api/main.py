from agent_controller import AgentController
import runpod
def main():
    agent_controller = AgentController()
    runpod.serverless.start({"handler": agent_controller.get_response})
    """
    test_input = {
        "input": {
            "messages": [
                {"role": "user", "content": "Where is the cafe located"}
            ]
        }
    }

    response = agent_controller.get_response(test_input)
    print(response)
    print(response['content'])
    """

if __name__ == '__main__':
    main()