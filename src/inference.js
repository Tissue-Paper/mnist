let mnist_cnn, reader = new deeplearn.CheckpointLoader('./ckpt.9919');

reader.getAllVariables().then(function (vars) {
  const math = new deeplearn.NDArrayMathCPU(true);
  mnist_cnn = buildModelMathAPI(math, vars);
  document.querySelectorAll("button")[1].disabled = false;
});

function buildModelMathAPI(math, vars) {
  const W_conv1 = vars['conv1/Variable'];
  const b_conv1 = vars['conv1/Variable_1'];
  const W_conv2 = vars['conv2/Variable'];
  const b_conv2 = vars['conv2/Variable_1'];
  const W_fc1 = vars['fc1/Variable'];
  const b_fc1 = vars['fc1/Variable_1'];
  const W_fc2 = vars['fc2/Variable'];
  const b_fc2 = vars['fc2/Variable_1'];
    return function (x) {
        return math.scope(function (keepFn, trackFn) {
          const x_image = deeplearn.Array3D.new([28, 28, 1], x);
            const h_conv1 = math.relu(math.conv2d(x_image, W_conv1, b_conv1, 1, 2));
            const h_pool1 = math.maxPool(h_conv1, 2, 2, 0);
            const h_conv2 = math.relu(math.conv2d(h_pool1, W_conv2, b_conv2, 1, 2));
            const h_pool2 = math.maxPool(h_conv2, 2, 2, 0);
            const h_pool2_flat = h_pool2.reshape([784]);
            const h_fc1 = math.relu(math.add(math.vectorTimesMatrix(h_pool2_flat, W_fc1), b_fc1));
            const logits = math.softmax(math.add(math.vectorTimesMatrix(h_fc1, W_fc2), b_fc2));
            const topk = math.topK(logits, 3);
            return [keepFn(topk.indices), keepFn(topk.values)];
        });
    };
}