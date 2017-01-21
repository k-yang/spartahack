from keras.applications.vgg19 import VGG19
from keras.applications.vgg19 import preprocess_input
from keras.models import Model
import numpy as np
import glob, os

base_model = VGG19(weights='imagenet')
model = Model(input=base_model.input, output=base_model.get_layer('block4_pool').output)

def extract_intermediate_features(x):
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    block4_pool_features = model.predict(x)
    return block4_pool_features

def vid_extract_features(x_list):
    feature_list = []
    for x in x_list:
        feature_list.append(extract_intermediate_features(x))
    feature_list = np.asarray(feature_list)
    return feature_list

def batch_vids_extract(folder_name):
    samples = []
    n_samples = 0
    for file in os.listdir('./data'):
        if file.endswith('.out'):
            with open(file) as f:
                feature_list = vid_extract_features(f)
                samples.append(feature_list)
                n_samples += 1
    print 'n_samples: ' + n_samples + 'for class: ' + folder_name
    return samples