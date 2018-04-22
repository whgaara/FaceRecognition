# coding: utf-8
import base64
from django.http import JsonResponse
from face_recognition.common import *

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognition.settings')
django.setup()

def get_data(request=None):
    result = {'data': '',
              'code': '200'}
    img_path = settings.IMG_PATH
    acupoints = format_logs()
    try:
        for i, file in enumerate(os.listdir(img_path)):
            f = open(img_path + file, 'rb')
            image_data = f.read()
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            acupoints[i]['data'] = image_b64
            f.close()
        result['data'] = acupoints
    except Exception as e:
        print(e)
        result['code'] = '400'
    # f = open('test.txt', 'w', encoding='utf-8')
    # f.write(str(result))
    # f.close()
    return JsonResponse(result)


if __name__ == '__main__':
    get_data()
