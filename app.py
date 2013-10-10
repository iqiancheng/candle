#-*-coding:utf-8-*-

from flask import Flask, request
from rq import Queue
from redis import Redis
from task import send_to_kindle

q = Queue('gen_book', connection=Redis())

app = Flask(__name__)

@app.route('/')
def index():
    return 'index'

@app.route('/send', methods=['GET', 'POST'])
def send():
    if request.method == 'GET':
        return '不是让你打开啊！！这个地址是填到设置里面的！！'

    book_id = request.form['book_id']
    book_data = request.form['book_data']
    to_email = request.form['to_email']
    q.enqueue(send_to_kindle, book_id, book_data, to_email)
    return 'ok'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
