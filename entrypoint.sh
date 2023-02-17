#!/bin/sh
# Copyright 2022 Cartesi Pte. Ltd.
# Copyright 2023 Ultrachess team
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

# Enable strict shell mode
set -o errexit
set -o nounset
set -o pipefail

################################################################################
# Environement configuration
################################################################################

# The current Python version
PYTHON_VERSION="3.10"

################################################################################
# Environement paths
################################################################################

# Get the absolute path to the entrypoint script
SCRIPT_DIR="$(pwd)"

# Add the "bin" subdirectory to PATH
export PATH="${SCRIPT_DIR}/bin:${PATH}"

# Add the Python cross environment to PYTHONPATH
export PYTHONPATH="${SCRIPT_DIR}/server/.venv/cross/lib/python${PYTHON_VERSION}/site-packages"

################################################################################
# Entry point
################################################################################

cd server && rollup-init python3 main.py
