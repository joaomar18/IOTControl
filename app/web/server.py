###########EXERTNAL IMPORTS############

import os
import asyncio
from flask import Flask, render_template, request
from gevent.pywsgi import WSGIServer

#######################################

#############LOCAL IMPORTS#############

import data.queues as queues
import data.general as general

#######################################

template_dir = str(os.path.abspath('./static'))
app = Flask(__name__, static_folder=template_dir, template_folder= template_dir)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/energy-analyzer', methods=['GET', 'POST'])
def ua_energy_analyzer_index():
    device_name = request.args.get('name')  # Get the value of the 'name' parameter
    return render_template('ua_energy_analyzer/index.html', device_name=device_name)

@app.route('/image-process')
def image_process_index():
    return render_template('image_process/index.html')

def run():
    eventLoop = asyncio.new_event_loop()
    http_server = WSGIServer(('0.0.0.0', 8000), app)
    eventLoop.run_until_complete(http_server.serve_forever())
    eventLoop.close()
    