import json


def convert_to_hex(s_input):
    return "0x" + str(s_input.encode("utf-8").hex())


class ActionManager:
    def __init__(self):
        self.actions = {}

    def process(self, id, value):
        self.actions[str(id)] = value

    def result(self, id):
        print(self.actions)
        print(id)
        json_object = json.dumps(self.actions[str(id)])
        hex_string = convert_to_hex(json_object)
        return hex_string

    def actionIndex(self):
        return len(list(self.actions.values()))

    def actionList(self):
        return list(self.actions.keys())
