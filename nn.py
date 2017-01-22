from keras.models import Sequential
from keras.layers.core import Dense, LSTM
import numpy as np
from classifier import batch_vids_extract

class1 = "hello"
X = batch_vids_extract(class1)
Y = np.asarray([[1],[2],[3],[4]])

model = Sequential()
model.add(LSTM(100, input_shape=(16,)))
model.add(Dense(2, activation="tanh"))
model.add(Dense(4, activation="softmax"))

model.compile(loss="sparse_categorical_crossentropy", optimizer="adagrad")
model.fit(X, Y, nb_epoch=10, batch_size=100)