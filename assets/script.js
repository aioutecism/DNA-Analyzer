window.addEventListener('load', function() {
	DNA.init();
});

var DNA = {
	dnaSeqs: {},
	recognitors: {},
	rebaseRecognitor: function(recognitor) {
		return recognitor
			.replace(/R/g, '[GA]')
			.replace(/Y/g, '[CT]')
			.replace(/M/g, '[AC]')
			.replace(/K/g, '[GT]')
			.replace(/S/g, '[GC]')
			.replace(/W/g, '[AT]')
			.replace(/B/g, '[CGT]')
			.replace(/D/g, '[AGT]')
			.replace(/H/g, '[ACT]')
			.replace(/V/g, '[ACG]')
			.replace(/N/g, '[ACGT]')
		;
	},
	init: function() {
		this.$dnaSeqs = document.getElementById('dnaSeqs');
		this.$recognitors = document.getElementById('recognitors');
		this.$submit = document.getElementById('submit');
		this.$result = document.getElementById('result');

		this.$submit.addEventListener('click', this.analyze);
	},
	analyze: function() {
		var self = DNA;

		self.readDnaSeqs();
		if(!Object.keys(self.dnaSeqs).length) return;

		self.readRecognitors();
		if(!Object.keys(self.recognitors).length) return;

		var counts = {};

		for(var dnaName in self.dnaSeqs) {
			var dnaSeq = self.dnaSeqs[dnaName];
			var recCount = {};

			for(var recName in self.recognitors) {
				var recognitor = self.recognitors[recName];
				var matches = dnaSeq.match(new RegExp(recognitor, 'g'));
				recCount[recName] = matches ? matches.length : 0;
			}

			counts[dnaName] = recCount;
		}

		var result = {};

		for(var recName in self.recognitors) {
			var numbers = [];

			for(var dnaName in self.dnaSeqs) {
				var count = counts[dnaName][recName];
				if(numbers.indexOf(count) === -1)
					numbers.push(count);
			}

			result[recName] = numbers.length;
		}

		self.print(counts, result);
	},
	readDnaSeqs: function() {
		var self = DNA;

		self.dnaSeqs = {};

		var input = self.$dnaSeqs.value;
		var lines = input.split("\n");

		for(var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if(line.substr(0, 1) === '>') {
				self.dnaSeqs[line.substr(1)] = lines[++i];
			}
		}
	},
	readRecognitors: function() {
		var self = DNA;

		self.recognitors = {};

		var input = self.$recognitors.value;
		var lines = input.split("\n");

		for(var i = 0; i < lines.length; i++) {
			var _ = lines[i].split("\t");
			var name = _[0];
			var recognitor = _[1];
			if(!name || !recognitor) continue;

			self.recognitors[name] = self.rebaseRecognitor(recognitor);
		}
	},
	print: function(counts, result) {
		var self = DNA;

		// --- COUNT --- //
		// print recognitors' row
		{
			var tr = document.createElement('tr');
			tr.appendChild(document.createElement('td'));
			for(var recName in self.recognitors) {
				var td = document.createElement('td');
				td.innerHTML = recName;
				tr.appendChild(td);
			}
			self.$result.appendChild(tr);
		}

		// print counts' rows
		for(var dnaName in counts) {
			var recCounts = counts[dnaName];

			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.innerHTML = dnaName;
			tr.appendChild(td);

			for(var recName in recCounts) {
				var count = recCounts[recName];

				var td = document.createElement('td');
				td.innerHTML = count;
				tr.appendChild(td);
			}

			self.$result.appendChild(tr);
		}

		// print result's row
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.innerHTML = 'Differences';
		tr.appendChild(td);

		for(var recName in result) {
			var count = result[recName];
			var td = document.createElement('td');
			td.innerHTML = count;
			tr.appendChild(td);
		}
		self.$result.appendChild(tr);
	}
};