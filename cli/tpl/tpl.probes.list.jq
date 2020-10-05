.items? |
if (length > 0) then map({
	"name": .name,
	"endpoint": .endpoint,
	"status": .status
}) else empty end
