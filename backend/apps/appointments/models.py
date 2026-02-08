class Appointment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)

    start = models.DateTimeField()
    end = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('confirmed', 'Confirmada'),
            ('in_progress', 'En atención'),
            ('completed', 'Finalizada'),
            ('cancelled', 'Cancelada'),
        ],
        default='pending'
    )

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)