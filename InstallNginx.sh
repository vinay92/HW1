#!/bin/bash

cd ansible
ansible-playbook nginx.yml -i inventory
