# coding: utf-8

import os
from FaceRecognition import settings


def format_logs():
    acupoints_list = []

    for log_file in os.listdir(settings.LOG_PATH):
        f = open(settings.LOG_PATH + log_file, 'r', encoding='utf_8_sig')
        log_data = f.read()
        acupoints = log_data.split('\n')
        acupoints_dict = {}
        for acupoint in acupoints:
            acu_attrs = acupoint.split(',', 1)
            acupoints_dict[acu_attrs[0]] = acu_attrs[1]
        acupoints_list.append(acupoints_dict)
        f.close()

    return acupoints_list


if __name__ == '__main__':
    format_logs()
