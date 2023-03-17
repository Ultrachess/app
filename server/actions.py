# Copyright 2022-2023 Ultrachess team
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

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
