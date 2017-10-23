let mnist_cnn, reader = new deeplearn.CheckpointLoader('./ckpt.9919');

reader.getAllVariables().then(function (vars) {
  const [inputPlace, probs] = buildModelGraphAPI(vars);
  const math = new deeplearn.NDArrayMathCPU();
  const sess = new deeplearn.Session(inputPlace.node.graph, math);

  mnist_cnn = function(input) {
    return math.scope(function(keepFn, trackFn){
      const inputData = deeplearn.Array1D.new(input);
      const probsVal = sess.eval(probs, [{ tensor: inputPlace, data: inputData }]);
      const topk = math.topK(probsVal, 3);
      return [keepFn(topk.indices), keepFn(topk.values)];
    });
  };
  document.querySelectorAll("button")[1].disabled = false;
});

function buildModelGraphAPI(vars) {
  const g = new deeplearn.Graph();
  const input = g.placeholder('input', [784]);
  const x_image = g.reshape(input, [28, 28, 1]);
  const W_conv1 = g.constant(vars['conv1/Variable']);
  const b_conv1 = g.constant(vars['conv1/Variable_1']);
  const h_conv1 = g.relu(g.conv2d(x_image, W_conv1, b_conv1, 5, 8, 1, 2));
  const h_pool1 = g.maxPool(h_conv1, 2, 2, 0);
  const W_conv2 = g.constant(vars['conv2/Variable']);
  const b_conv2 = g.constant(vars['conv2/Variable_1']);
  const h_conv2 = g.relu(g.conv2d(h_pool1, W_conv2, b_conv2, 5, 16, 1, 2));
  const h_pool2 = g.maxPool(h_conv2, 2, 2, 0);
  const h_pool2_flat = g.reshape(h_pool2, [784]);
  const W_fc1 = g.constant(vars['fc1/Variable']);
  const b_fc1 = g.constant(vars['fc1/Variable_1']);
  const h_fc1 = g.relu(g.add(g.matmul(h_pool2_flat, W_fc1), b_fc1));
  const W_fc2 = g.constant(vars['fc2/Variable']);
  const b_fc2 = g.constant(vars['fc2/Variable_1']);
  const logits = g.softmax(g.add(g.matmul(h_fc1, W_fc2), b_fc2));
  return [input, logits];
}