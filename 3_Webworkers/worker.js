self.onmessage = sleep
function sleep(event)
{
	n = parseInt(event.data)
	d1 = new Date()
	m1 = d1.getTime()
	m2 = d1.getTime()
	while((m2 - m1) != n * 1000)
	{
		d1 = new Date()
		m2 = d1.getTime()				
	}
	postMessage("done")
}